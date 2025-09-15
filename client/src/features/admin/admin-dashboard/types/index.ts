export interface IWorkspace {
  _id: string;
  creator: string;
  name: string;
  description: string;
  tags: string[];
  users: string[];
  campaigns: string[];
  creationDate: string;
  __v: number;
}
