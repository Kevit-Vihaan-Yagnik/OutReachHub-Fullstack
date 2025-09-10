import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IWorkspaceRow } from "../types";

export interface WorkspaceState {
    workspaces: IWorkspaceRow[];
    loading: boolean;
    error: string | null;
}

const initialState: WorkspaceState = {
    workspaces: [],
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action: PayloadAction<IWorkspaceRow[]>) => {
            state.workspaces = action.payload;
            state.loading = false;
            state.error = null;
        },
        addWorkspace: (state, action: PayloadAction<IWorkspaceRow>) => {
            state.workspaces.push(action.payload);
        },
        updateWorkspace: (state, action: PayloadAction<IWorkspaceRow>) => {
            const idx = state.workspaces.findIndex(w => w.id === action.payload.id);
            if (idx !== -1) state.workspaces[idx] = action.payload;
        },
        removeWorkspace: (state, action: PayloadAction<string>) => {
            state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setWorkspaces,
    addWorkspace,
    updateWorkspace,
    removeWorkspace,
    setLoading,
    setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
