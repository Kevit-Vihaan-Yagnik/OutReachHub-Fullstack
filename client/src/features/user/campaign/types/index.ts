import * as yup from "yup";

export interface ICampaign {
  _id: string;
  workspaceId: string;
  creator: string;
  templateId: string;
  lastModifiedBy: string;
  name: string;
  tags: string[];
  status: "Draft" | "Running" | "Completed";
  startDate: string;
  endDate: string;
  audienceSize: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICampaignFormData {
  templateId: string;
  name: string;
  tags: string[];
  status: "Draft";
  startDate: string | Date;
  endDate: string | Date;
}

export interface ICampaignDetail {
  _id: string;
  workspaceId: string;
  creator: {
    _id: string;
    contactInfo: {
      email: string;
    };
  };
  templateId: {
    _id: string;
    workspaceId: string;
    title: string;
    type: string;
    template: string;
    userId: string;
    isDeleted: boolean;
    __v: number;
  };
  lastModifiedBy: {
    _id: string;
    contactInfo: {
      email: string;
    };
  };
  name: string;
  tags: string[];
  status: "Draft" | "Running" | "Completed"; 
  startDate: string; 
  endDate: string;   
  audienceSize: number;
  isDeleted: boolean;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
  preparedAt: string; 
}

export interface ICampaignRecipient {
  _id: string;
  campaignId: string;
  contactId: string;
  email: string;
  name: string;
  status: "queued" | "sent" | "failed" | "delivered";
  __v: number;
}

export interface ICampaignStartRes {
  message: string;
  campaignId : string;
  audienceSize : number;
}

// {
//     "message": "campaign started",
//     "campaignId": "68be791bef534eaded8c33f4",
//     "audienceSize": 2
// }


// validation schema
export const schema: yup.ObjectSchema<ICampaignFormData> = yup.object().shape({
  templateId: yup.string().required("Template ID is required"),
  name: yup.string().required("Campaign name is required"),
  tags: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one tag")
    .required(),
  status: yup.mixed<"Draft">().oneOf(["Draft"]).required(),
  startDate: yup
  .date()
  .transform((value, originalValue) =>
    originalValue ? new Date(originalValue) : value
  )
  .required("Start date is required"),

endDate: yup
  .date()
  .transform((value, originalValue) =>
    originalValue ? new Date(originalValue) : value
  )
  .min(yup.ref("startDate"), "End date cannot be before start date")
  .required("End date is required"),

});
