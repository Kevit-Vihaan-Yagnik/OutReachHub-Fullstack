import { get, post } from "@/utils/api.util";
import type {
  ICampaign,
  ICampaignDetail,
  ICampaignFormData,
  ICampaignRecipient,
} from "../types";

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

export const getCampignDetails = async (
  campaignId: string
): Promise<ICampaignDetail> => {
  return await get(`/campaign/detail/${campaignId}`);
};

export const getContactOfCampaign = async (
  campaingId: string
): Promise<ICampaignRecipient> => {
  return await get(`campaign/contactInfo/${campaingId}`);
};
