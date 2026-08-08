import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import { cinemaApi } from './services/api.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [cinemaApi.reducerPath]: cinemaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cinemaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
