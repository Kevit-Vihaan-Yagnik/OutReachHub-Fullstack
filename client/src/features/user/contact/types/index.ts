import * as yup from 'yup';

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


export interface IContactFormData {
  name: string;
  profilePicture: string;
  countryCode: string;
  phoneNo: number;
  email: string;
  company: string;
  jobTitle: string;
  tags: string[]; 
}

export const schema = yup.object({
  name: yup.string().required("Name is required"),
  profilePicture: yup.string().url("Must be a valid URL").default("https://www.w3schools.com/howto/img_avatar.png"),
  countryCode: yup.string().required("Country code is required"),
  phoneNo: yup
    .number()
    .typeError("Phone number must be a number")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  company: yup.string().default("").required("Company is required"),
  jobTitle: yup.string().default("").required("JobTitle is required"),
  tags: yup.array().of(yup.string().defined()).default([]).min(1, "Please select at least one tag") // 👈 enforce required
    .required("Please select tags"),
});