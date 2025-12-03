import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { IMessageTemplate } from '../types';

export interface MessageTemplateState {
  messageTemplates: IMessageTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageTemplateState = {
  messageTemplates: [],
  loading: false,
  error: null,
};

const messageTemplateSlice = createSlice({
  name: 'messageTemplate',
  initialState,
  reducers: {
    setMessageTemplate(state, action: PayloadAction<IMessageTemplate[]>) {
      state.messageTemplates = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMessageTemplate(state, action: PayloadAction<IMessageTemplate>) {
      state.messageTemplates.push(action.payload);
    },
    updateMessageTemplate(state, action: PayloadAction<IMessageTemplate>) {
      const idx = state.messageTemplates.findIndex((m) => m._id === action.payload._id);
      if (idx !== 1) {
        state.messageTemplates[idx] = action.payload;
      }
    },
    deleteMessageTemplate(state, action: PayloadAction<string>) {
      state.messageTemplates = state.messageTemplates.filter((m) => m._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetMessageTemplates(state) {
      state.messageTemplates = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setMessageTemplate,
  addMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  setLoading,
  setError,
  resetMessageTemplates,
} = messageTemplateSlice.actions;

export default messageTemplateSlice.reducer;
