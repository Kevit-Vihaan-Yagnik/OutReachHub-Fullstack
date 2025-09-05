import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ICampaign } from "../types";

export interface CampaignState {
  campaigns: ICampaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaigns(state, action: PayloadAction<ICampaign[]>) {
      state.campaigns = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCampaign(state, action: PayloadAction<ICampaign>) {
      state.campaigns.push(action.payload);
    },
    updateCampaign(state, action: PayloadAction<ICampaign>) {
      const idx = state.campaigns.findIndex(
        (c) => c._id === action.payload._id
      );
      if (idx !== -1) {
        state.campaigns[idx] = action.payload;
      }
    },
    deleteCampaign(state, action: PayloadAction<string>) {
      state.campaigns = state.campaigns.filter(
        (c) => c._id !== action.payload
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetCampaigns(state) {
      state.campaigns = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  setLoading,
  setError,
  resetCampaigns,
} = campaignSlice.actions;

export default campaignSlice.reducer;
