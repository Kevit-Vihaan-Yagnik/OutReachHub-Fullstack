export interface ICampaign {
  _id: string;
  workspaceId: string;
  creator: string;
  templateId: string;
  lastModifiedBy: string;
  name: string;
  tags: string[];
  status: 'Draft' | 'Running' | 'Completed' | 'Paused' | string; // flexible enum
  startDate: string;
  endDate: string;
  audienceSize: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  preparedAt?: string;
  __v: number;
}

export interface ICampaignRow {
  id: string;
  name: string;
  status: string;
  audienceSize: number;
  startDate: string;
  endDate: string;
}
