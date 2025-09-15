// features/contact/slices/contactSlice.ts
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { IContact } from '../types';

export interface ContactState {
  contacts: IContact[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<IContact[]>) {
      state.contacts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addContact(state, action: PayloadAction<IContact>) {
      state.contacts.push(action.payload);
    },
    updateContact(state, action: PayloadAction<IContact>) {
      const idx = state.contacts.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) {
        state.contacts[idx] = action.payload;
      }
    },
    deleteContact(state, action: PayloadAction<string>) {
      state.contacts = state.contacts.filter((c) => c._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetContacts(state) {
      state.contacts = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setContacts,
  addContact,
  updateContact,
  deleteContact,
  setLoading,
  setError,
  resetContacts,
} = contactSlice.actions;

export default contactSlice.reducer;
