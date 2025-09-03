import { get, patch, post } from "@/utils/api.util";
import type { IContact, IContactFormData, IContactResponse } from "../types";

export const getContactsByWorkspace = async (
  workspaceId: string
): Promise<IContact[]> => {
  const res: IContactResponse = await get(`/contact/${workspaceId}`);
  return res.data;
};

export const addContactToWorkspace = async (
  workspaceId: string,
  data: IContactFormData
): Promise<IContact> => {
  const body = {
    contacts: [
      {
        name: data.name,
        profilePicture: data.profilePicture,
        contactInfo: {
          countryCode: data.countryCode,
          phoneNo: data.phoneNo,
          email: data.email,
        },
        company: data.company,
        jobTitle: data.jobTitle,
        tags: data.tags,
      },
    ],
  };

  const res: { data: IContact[]; message: string } = await post(
    `/contact/${workspaceId}`,
    body
  );

  return res.data[0];
};

export const getContactById = async (workspaceId : string , contactId: string): Promise<IContact> => {
  const res: { message: string; data: IContact } = await get(`/contact/${workspaceId}/${contactId}`);
  return res.data;
};

export const updateContactApi = async (
  workspaceId: string,
  contactId: string,
  data: IContactFormData
): Promise<IContact> => {
  // 🔹 Transform IContactFormData into the API payload shape
  const payload = {
    name: data.name,
    profilePicture: data.profilePicture,
    contactInfo: {
      countryCode: data.countryCode,
      phoneNo: data.phoneNo,
      email: data.email,
    },
    company: data.company,
    jobTitle: data.jobTitle,
    tags: data.tags,
  };

  const res: { message: string; data: IContact } = await patch(
    `/contact/${workspaceId}/${contactId}`,
    payload
  );

  return res.data;
};