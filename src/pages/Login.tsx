import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Film, Lock, Mail, Shield, AlertCircle, CheckCircle2, User as UserIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import { apiJsonFetch, setAuthTokens } from '../utils/api.js';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const isAdminQuery = searchParams.get('admin') === 'true';
  const isExpiredQuery = searchParams.get('expired') === 'true';
  const [isAdminMode, setIsAdminMode] = useState(isAdminQuery);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(isExpiredQuery ? 'Your session has expired. Please log in again.' : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminQuery) {
      setIsAdminMode(true);
      setEmail('admin');
      setPassword('admin123');
    }
  }, [isAdminQuery]);

  useEffect(() => {
    const handleSessionExpired = (e: any) => {
      setError(e.detail || 'Your session has expired. Please log in again.');
    };
    window.addEventListener('cinema:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('cinema:session-expired', handleSessionExpired);
    };
  }, []);

  const handleModeSwitch = (admin: boolean) => {
    setIsAdminMode(admin);
    setError('');
    if (admin) {
      setEmail('admin');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleFillAdmin = () => {
    setIsAdminMode(true);
    setEmail('admin');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isAdminMode ? '/auth/admin/login' : '/auth/login';
      const data = await apiJsonFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!data.token || typeof data.token !== 'string' || data.token === 'undefined' || data.token === 'null') {
        throw new Error('Authentication succeeded but server did not return a valid JWT token string.');
      }

      // Persist token & user object cleanly in localStorage and Redux store
      setAuthTokens(data.token, data.user);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      
      if (data.user?.role === 'admin' || isAdminMode) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-sm space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#E50914] text-white mx-auto flex items-center justify-center rounded-sm shadow-lg shadow-[#E50914]/20">
            {isAdminMode ? <Shield className="w-6 h-6" /> : <Film className="w-6 h-6 fill-white" />}
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {isAdminMode ? 'ADMIN CONSOLE LOGIN' : 'SIGN IN TO CINEMA'}
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase">
            {isAdminMode ? 'Access catalog management & website settings' : 'Welcome back to your cinematic portal'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-sm border border-zinc-800">
          <button
            type="button"
            onClick={() => handleModeSwitch(false)}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 ${
              !isAdminMode ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>User Login</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch(true)}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 ${
              isAdminMode ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Quick Admin Auto-fill Banner */}
        {isAdminMode && (
          <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-sm space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-300 font-bold">
              <span className="flex items-center gap-1.5 text-[#E50914]">
                <Shield className="w-3.5 h-3.5" /> Default Admin Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-[10px] uppercase font-black tracking-wider text-zinc-400 hover:text-white underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded-sm border border-zinc-900">
              <div><span className="text-zinc-500">Username:</span> admin</div>
              <div><span className="text-zinc-500">Password:</span> admin123</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {isAdminMode ? 'USERNAME OR EMAIL' : 'EMAIL ADDRESS'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminMode ? 'admin' : 'user@cinema.com'}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-red-700 text-white font-black py-3 rounded-sm text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2"
          >
            {loading ? 'SIGNING IN...' : isAdminMode ? 'LOGIN TO ADMIN CONSOLE' : 'SIGN IN'}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-900 text-center text-xs font-bold text-zinc-500 uppercase">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#E50914] hover:underline">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};
