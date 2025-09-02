import { get } from "@/utils/api.util";
import type { ICampaign } from "../types";

export const getCampaignsByWorkspace = async (workspaceId: string): Promise<ICampaign[]> => {
  return await get(`/campaign/${workspaceId}`);
};