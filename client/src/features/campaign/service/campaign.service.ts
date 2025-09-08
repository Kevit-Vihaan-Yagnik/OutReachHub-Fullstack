import { del, get, patch, post } from "@/utils/api.util";
import type {
  ICampaign,
  ICampaignDetail,
  ICampaignFormData,
  ICampaignRecipient,
  ICampaignStartRes,
} from "../types";


export const mapCampaignDetailToCampaign = (detail: ICampaignDetail): ICampaign => ({
  _id: detail._id,
  workspaceId: detail.workspaceId,
  creator: detail.creator._id,
  templateId: detail.templateId._id,
  lastModifiedBy: detail.lastModifiedBy._id,
  name: detail.name,
  tags: detail.tags,
  status: detail.status,
  startDate: detail.startDate,
  endDate: detail.endDate,
  audienceSize: detail.audienceSize,
  isDeleted: detail.isDeleted,
  createdAt: detail.createdAt,
  updatedAt: detail.updatedAt,
  __v: detail.__v,
});


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
  return await get(`/campaign/contactInfo/${campaingId}`);
};

export const runCampaignNow = async (
  campaignId: string
): Promise<ICampaignStartRes> => {
  return await post(`/campaign/${campaignId}/run-now`, {});
};

export const updateCampaignApi = async (
  campaignId: string,
  workspaceId: string,
  data: ICampaignFormData
): Promise<ICampaign> => {
  return await patch(`/campaign/${campaignId}/${workspaceId}`, data);
};

export const deleteCampaignApi = async (
  campaignId: string,
  workspaceId: string,
) => {
  return await del(`/campaign/${campaignId}/${workspaceId}`);
}