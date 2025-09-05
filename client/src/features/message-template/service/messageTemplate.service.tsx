import { del, get, post } from "@/utils/api.util";
import type { IMessageTemplate, ITemplateFormData } from "../types";

export const getMessageTemplatesApi = async (
  workspaceId: string
): Promise<IMessageTemplate[]> => {
  return await get(`/messageTemplate/${workspaceId}`);
};

export const createMessageTemplate = async (
  workspaceId: string,
  data: ITemplateFormData
): Promise<IMessageTemplate> => {
  return await post(`/messageTemplate/${workspaceId}`, data);
};

export const deleteMessageTemplateApi = async (
  workspaceId: string,
  templateId: string
): Promise<{ message: string }> => {
  return await del(`/messageTemplate/${workspaceId}/${templateId}`);
};
