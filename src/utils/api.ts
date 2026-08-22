// Centralized API configuration and client utility for decoupled deployment (Vercel + Render/Railway)

/**
 * Clean base URL derived from VITE_API_URL environment variable.
 * Examples:
 * - Empty / local: "" (proxies or relative)
 * - Render / Railway with /api: "https://cinema-api.onrender.com/api"
 * - Render / Railway root: "https://cinema-api.onrender.com"
 */
const rawEnvApiUrl: string = (
  ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || ''
).trim().replace(/\/+$/, '');

export const API_BASE_URL: string = rawEnvApiUrl;

/**
 * Token management helpers ensuring valid JWT strings only
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('cinema_token') || localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null' || token === '[object Object]') {
    return null;
  }
  return token;
}

export function setAuthTokens(token: string, user?: any): void {
  if (typeof window === 'undefined') return;
  if (!token || typeof token !== 'string' || token === 'undefined' || token === 'null') {
    console.error('Refusing to save invalid authentication token:', token);
    return;
  }
  localStorage.setItem('cinema_token', token);
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('cinema_user', JSON.stringify(user));
  }
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cinema_token');
  localStorage.removeItem('token');
  localStorage.removeItem('cinema_user');
}

/**
 * Resolves full API URL with support for standalone backend (Render/Railway) or local same-origin proxy.
 * Prevents duplicated paths such as /api/api/...
 */
export function getApiUrl(path: string): string {
  // If absolute URL provided, return as is
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If no external VITE_API_URL is configured (using relative /api proxy)
  if (!API_BASE_URL) {
    return cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  }

  // If VITE_API_URL already ends with '/api'
  if (API_BASE_URL.endsWith('/api')) {
    const subPath = cleanPath.startsWith('/api') ? cleanPath.slice(4) : cleanPath;
    return `${API_BASE_URL}${subPath.startsWith('/') ? subPath : `/${subPath}`}`;
  }

  // If VITE_API_URL is root host e.g. "https://cinema-api.onrender.com"
  const apiPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  return `${API_BASE_URL}${apiPath}`;
}

/**
 * Enhanced fetch wrapper that attaches resolved base URL and authorization header automatically
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(path);
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Safe JSON API Client:
 * 1. Guarantees non-JSON responses (e.g. 404 HTML, "The page could not be found") are caught cleanly
 * 2. Parses JSON without "Unexpected token 'T'" runtime crashes
 * 3. Handles 401 Unauthorized sessions automatically by clearing invalid tokens
 * 4. Throws structured descriptive errors for UI consumption
 */
export async function apiJsonFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, options);
  const contentType = response.headers.get('content-type') || '';

  // Check if response is JSON
  if (!contentType.includes('application/json')) {
    const rawText = await response.text();
    const cleanSnippet = rawText.trim().substring(0, 160).replace(/\s+/g, ' ');

    if (response.status === 404) {
      throw new Error(
        `Backend API endpoint not found (HTTP 404). Response: "${cleanSnippet}". Please check backend routes and ensure VITE_API_URL points to your active server (e.g. https://your-backend.onrender.com/api).`
      );
    }

    throw new Error(
      `Server returned a non-JSON response (HTTP ${response.status}). Response: "${cleanSnippet}". Please verify server status.`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch (jsonErr: any) {
    throw new Error(`Failed to parse JSON response from server: ${jsonErr.message}`);
  }

  // Automatically handle 401 Unauthorized / Expired Tokens
  if (response.status === 401) {
    clearAuthTokens();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cinema:session-expired', {
          detail: data?.message || 'Your session has expired. Please log in again.',
        })
      );
    }
    throw new Error(data?.message || 'Your session has expired. Please log in again.');
  }

  // Handle other HTTP errors or explicitly unsuccessful payloads
  if (!response.ok || data.success === false) {
    const errorMsg = data?.message || data?.error || `Request failed with status code ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
