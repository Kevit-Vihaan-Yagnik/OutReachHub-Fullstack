import { get, post } from "@/utils/api.util";
import type { ICampaign, ICampaignFormData } from "../types";

export const getCampaignsByWorkspace = async (
  workspaceId: string
): Promise<ICampaign[]> => {
  return await get(`/campaign/${workspaceId}`);
};

export const createCampaignApi = async (
  workspaceId: string,
  data: ICampaignFormData
): Promise<ICampaign> => {
  return await post(`/campaign/${workspaceId}`, data);
};
