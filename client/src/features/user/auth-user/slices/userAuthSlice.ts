import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { ICurrentWorkspace } from '@/features/user/user-dashboard/types';

import type { IUserResponse } from '../types';

type UserAuthState = {
  user: IUserResponse | null;
  currentWorkspace: ICurrentWorkspace | null;
};

const initialState: UserAuthState = {
  user: JSON.parse(localStorage.getItem('userAuth') || 'null'),
  currentWorkspace: JSON.parse(localStorage.getItem('currentWorkspace') || 'null'),
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<IUserResponse>) => {
      state.user = action.payload;
      localStorage.setItem('userAuth', JSON.stringify(action.payload));
    },
    userLogout: (state) => {
      state.user = null;
      localStorage.removeItem('userAuth');
      localStorage.removeItem('currentWorkspace');
    },
    userSetTokens: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>,
    ) => {
      if (state.user) {
        state.user.access_token = action.payload.access_token;
        state.user.refresh_token = action.payload.refresh_token;

        // ✅ keep user persisted in localStorage
        localStorage.setItem('userAuth', JSON.stringify(state.user));
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<ICurrentWorkspace | null>) => {
      state.currentWorkspace = action.payload;
      if (action.payload) {
        localStorage.setItem('currentWorkspace', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('currentWorkspace');
      }
    },
  },
});

export const { userLogin, userLogout, userSetTokens, setCurrentWorkspace } = userAuthSlice.actions;
export default userAuthSlice.reducer;
