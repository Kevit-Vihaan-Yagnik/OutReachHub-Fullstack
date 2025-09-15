import { get } from '@/utils/api.util';

import type { IWorkspace } from '../types';

export const analytics = async (): Promise<IWorkspace[]> => {
  return await get('/workspace');
};
