import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/index.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('cinema_token') : null;
const initialUserStr = typeof window !== 'undefined' ? localStorage.getItem('cinema_user') : null;

let parsedUser: User | null = null;
if (initialUserStr) {
  try {
    parsedUser = JSON.parse(initialUserStr);
  } catch (e) {}
}

const initialState: AuthState = {
  user: parsedUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('cinema_token', action.payload.token);
      localStorage.setItem('cinema_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('cinema_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
