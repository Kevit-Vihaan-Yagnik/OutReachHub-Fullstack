import { configureStore } from '@reduxjs/toolkit';

import adminAuthReducer from '@/features/admin/auth/slices/adminAuthSlice';
import adminWorkspaceReducer from '@/features/admin/workspace/slices/workspaceAdminSlice';
import userAuthReducer from '@/features/user/auth-user/slices/userAuthSlice';
import campaingReducer from '@/features/user/campaign/slices/campaignSlice';
import contactReducer from '@/features/user/contact/slices/contactSlice';
import messageTemplateReducer from '@/features/user/message-template/slices/messageTemplateSlice';
import userWorkspaceReducer from '@/features/user/user-dashboard/slice/userWorkspaceSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer,
    adminWorkspace: adminWorkspaceReducer,
    contact: contactReducer,
    userWorkspace: userWorkspaceReducer,
    messageTemplate: messageTemplateReducer,
    campaign: campaingReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
