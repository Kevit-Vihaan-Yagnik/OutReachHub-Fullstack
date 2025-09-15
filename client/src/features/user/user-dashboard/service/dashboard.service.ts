import type { IWorkspace } from '@/features/admin/workspace/types';
import { get } from '@/utils/api.util';

import type { IUserDetail } from '../types';

//Get User Detail
export const getUserDetail = async (userId: string): Promise<IUserDetail> => {
  return await get(`/auth/user/detail/${userId}`);
};

//GetWorkspace By Id
export const getWorkspaceById = async (workspaceId: string): Promise<IWorkspace> => {
  return await get(`/workspace/${workspaceId}`);
};
