export interface ICampaign {
  _id: string;
  workspaceId: string;
  creator: string;
  templateId: string;
  lastModifiedBy: string;
  name: string;
  tags: string[];
  status: "Draft" | "Running" | "Completed" | "Paused";
  startDate: string;
  endDate: string;
  audienceSize: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
