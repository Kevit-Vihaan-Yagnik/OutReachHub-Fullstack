// features/workspace/slices/workspaceUserSlice.ts
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type IWorkspace, type IWorkspaceUser } from '@/pages/admin/workspace/types';

export interface WorkspaceUserState {
  current: IWorkspace | null;
  tags: string[];
  users: { id: string; name: string }[];
  loading: boolean;
  error: string | null;
}

const persisted = localStorage.getItem('userWorkspace');

const initialState: WorkspaceUserState = persisted
  ? { ...JSON.parse(persisted), loading: false, error: null }
  : {
      current: null,
      tags: [],
      users: [],
      loading: false,
      error: null,
    };

const workspaceUserSlice = createSlice({
  name: 'workspaceUser',
  initialState,
  reducers: {
    setUserWorkspace: (state, action: PayloadAction<IWorkspace>) => {
      state.current = action.payload;

      // ✅ Tags
      state.tags = action.payload.tags || [];

      // ✅ Normalize users (string IDs or full objects)
      state.users =
        action.payload.users
          ?.map((u) => {
            if (typeof u === 'string') {
              return { id: u, name: 'Unknown User' }; // fallback for IDs
            }
            const userObj = u as IWorkspaceUser;
            return { id: userObj._id, name: userObj.name };
          })
          .filter(Boolean) || [];

      // ✅ Persist to localStorage
      localStorage.setItem(
        'userWorkspace',
        JSON.stringify({
          current: state.current,
          tags: state.tags,
          users: state.users,
        }),
      );
    },
    clearUserWorkspace: (state) => {
      state.current = null;
      state.tags = [];
      state.users = [];
      state.loading = false;
      state.error = null;

      localStorage.removeItem('userWorkspace');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUserWorkspace, clearUserWorkspace, setLoading, setError } =
  workspaceUserSlice.actions;

export default workspaceUserSlice.reducer;
