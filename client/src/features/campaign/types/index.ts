import * as yup from "yup";

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

export interface ICampaignFormData {
  templateId: string;
  name: string;
  tags: string[];
  status: "Draft";
  startDate: string | Date;
  endDate: string | Date;
}


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
