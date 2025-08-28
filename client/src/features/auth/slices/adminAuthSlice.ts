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
  },
});

export const { login, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
