import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUserResponse } from "../types";

type UserAuthState = {
    user: IUserResponse | null;
}

const initialState: UserAuthState = {
    user: JSON.parse(localStorage.getItem('userAuth') || 'null')
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
        },
        userSetTokens: (
            state,
            action: PayloadAction<{ access_token: string; refresh_token: string }>
        ) => {
            if (state.user) {
                state.user.access_token = action.payload.access_token;
                state.user.refresh_token = action.payload.refresh_token;

                // ✅ keep user persisted in localStorage
                localStorage.setItem('userAuth', JSON.stringify(state.user));
            }
        },
    }
})

export const { userLogin, userLogout, userSetTokens } = userAuthSlice.actions;
export default userAuthSlice.reducer;