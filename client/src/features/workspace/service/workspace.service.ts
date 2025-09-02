import { del, get, patch, post } from "@/utils/api.util";
import type { IWorkspace, IWorkspaceRow, IWorkspaceFormData, IAddMembersDto } from "../types";
import type { ICampaign, ICampaignRow } from "../types/campaign";

// 🔹 Mapper function to convert full Workspace → Row
const toWorkspaceRow = (ws: IWorkspace): IWorkspaceRow => ({
  id: ws._id,
  name: ws.name,
  description: ws.description,
  users: ws.users.length,
  campaigns: ws.campaigns.length,
  creationDate: ws.creationDate,
});

// 🔹 Get all workspaces (mapped to table rows) 
export const workspaces = async (): Promise<IWorkspaceRow[]> => {
  const res: IWorkspace[] = await get("/workspace");
  return res.map(toWorkspaceRow);
};

// 🔹 Create a new workspace
export const createWorkspace = async (data: IWorkspaceFormData): Promise<IWorkspaceRow> => {
  const res: IWorkspace = await post("/workspace", data);
  return toWorkspaceRow(res);
};

// 🔹 Add members to a workspace
export const addMembers = async (data: IAddMembersDto, workspaceId: string) => {
  const res = await post(`/workspace/${workspaceId}/members`, data);
  return res;
};

// 🔹 Get workspace by id
export const getWorkspaceById = async (workspaceId: string) : Promise<IWorkspace> => {
  return await get(`/workspace/${workspaceId}`)
}

// 🔹 Delete member by id
export const deleteMember = async (workspaceId: string, userId: string) : Promise<{message : string}> => {
  return  await del(`/workspace/${workspaceId}/members/${userId}`);
};
// 🔹 Edit workspace by id
export const updateWorkspaceApi = async (
  id: string,
  data: { name: string; description: string }
): Promise<{ message: string }> => {
  const res: { message: string } = await patch(`/workspace/${id}`, data);
  return res;
};

// 🔹 Add tags to workspace
export const addTags = async(workspaceId : string , data : {tags : string[]}) => {
  const res = await post(`/workspace/${workspaceId}/tags` , data)
  return res;
}

// 🔹 Delete tags from workspace
export const deleteTags = async(workspaceId : string , data : {tags : string[]}) => {
  const res = await post(`/workspace/${workspaceId}/delete/tags` , data)
  return res;
}

// 🔹 Get campaign by workspace
export const getCampaignsByWorkspace = async (workspaceId: string): Promise<ICampaignRow[]> => {
  const res: ICampaign[] = await get(`/campaign/${workspaceId}`);
  return res.map(c => ({
    id: c._id,
    name: c.name,
    status: c.status,
    audienceSize: c.audienceSize,
    startDate: c.startDate,
    endDate: c.endDate,
  }));
};