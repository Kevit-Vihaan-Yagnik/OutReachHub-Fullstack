import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Admin {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

type AdminAuthState = {
  admin: Admin | null;
};

const initialState: AdminAuthState = {
  admin: JSON.parse(localStorage.getItem('adminAuth') || 'null'),
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      localStorage.setItem('adminAuth', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.admin = null;
      localStorage.removeItem('adminAuth');
    },
    setTokens: (state, action: PayloadAction<{ access_token: string; refresh_token: string }>) => {
      if (state.admin) {
        state.admin.access_token = action.payload.access_token;
        state.admin.refresh_token = action.payload.refresh_token;

        // ✅ keep admin persisted in localStorage
        localStorage.setItem('adminAuth', JSON.stringify(state.admin));
      }
    },
  },
});

export const { login, logout, setTokens } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
