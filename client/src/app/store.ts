import { configureStore } from '@reduxjs/toolkit';

import snackbarReducer from '@/common/slices/snackbarSlice';
import adminAuthReducer from '@/pages/admin/auth/slices/adminAuthSlice';
import adminWorkspaceReducer from '@/pages/admin/workspace/slices/workspaceAdminSlice';
import userAuthReducer from '@/pages/user/auth-user/slices/userAuthSlice';
import campaingReducer from '@/pages/user/campaign/slices/campaignSlice';
import contactReducer from '@/pages/user/contact/slices/contactSlice';
import messageTemplateReducer from '@/pages/user/message-template/slices/messageTemplateSlice';
import userWorkspaceReducer from '@/pages/user/user-dashboard/slice/userWorkspaceSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer,
    adminWorkspace: adminWorkspaceReducer,
    contact: contactReducer,
    userWorkspace: userWorkspaceReducer,
    messageTemplate: messageTemplateReducer,
    campaign: campaingReducer,
    snackbar: snackbarReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
