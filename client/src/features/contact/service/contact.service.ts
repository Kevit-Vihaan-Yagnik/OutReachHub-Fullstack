import { get } from "@/utils/api.util";
import type { IContact, IContactResponse } from "../types";

export const getContactsByWorkspace = async (workspaceId: string): Promise<IContact[]> => {
  const res : IContactResponse = await get(`/contact/${workspaceId}`);
  return res.data;
};