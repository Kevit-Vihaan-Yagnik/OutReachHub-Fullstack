import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '@/features/auth/slices/adminAuthSlice';
import adminWorkspaceReducer from '@/features/workspace/slices/workspaceAdminSlice'
import userAuthReducer from '@/features/auth-user/slices/userAuthSlice';
import contactReducer from '@/features/contact/slices/contactSlice';
import userWorkspaceReducer from '@/features/user-dashboard/slice/userWorkspaceSlice'

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth : userAuthReducer,
    adminWorkspace : adminWorkspaceReducer,
    contact : contactReducer,
    userWorkspace : userWorkspaceReducer
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
