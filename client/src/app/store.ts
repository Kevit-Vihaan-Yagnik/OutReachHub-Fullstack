import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '@/features/auth/slices/adminAuthSlice';
import adminWorkspaceReducer from '@/features/workspace/slices/workspaceAdminSlice'

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminWorkspace : adminWorkspaceReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
