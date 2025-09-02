export interface IContact {
  _id: string;
  workspaceId: string;
  creator: string;
  name: string;
  profilePicture?: string;
  contactInfo: {
    countryCode: string;
    phoneNo: number;
    email: string;
    _id: string;
  };
  company?: string;
  jobTitle?: string;
  tags: string[];
  __v: number;
}

export interface IContactResponse {
  message: string;
  data: IContact[];
}
