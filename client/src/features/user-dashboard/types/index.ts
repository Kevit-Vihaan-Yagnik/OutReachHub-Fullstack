// ---- User detail response ----
export interface IUserDetail {
  _id: string;
  name: string;
  contactInfo: {
    countryCode: string;
    phoneNo: number;
    email: string;
    _id: string;
  };
  workspaces: IUserWorkspaceLink[];
  joinDate: string;
  __v: number;
}

export interface IUserWorkspaceLink {
  _id: string;
  workspaceId: {
    _id: string;
    name: string;
  };
  permission: {
    editor: boolean;
    viewer: boolean;
    allowAdd: boolean;
    _id: string;
  };
}

// what we store in Redux when a workspace is chosen
export interface ICurrentWorkspace {
  id: string;            
  name: string;          
  permission: {
    editor: boolean;
    viewer: boolean;
    allowAdd: boolean;
  };
}
