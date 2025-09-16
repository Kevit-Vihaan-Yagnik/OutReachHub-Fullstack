import * as yup from 'yup';

export interface IMessageTemplate {
  _id: string;
  workspaceId: string;
  title: string;
  type: 'text' | 'text-image';
  template: string;
  campaignImage?: string;
  userId: string;
  isDeleted: boolean;
  _v: number;
}

export interface ITemplateFormData {
  title: string;
  type: 'text' | 'text-image';
  template: string;
  campaignImage?: string;
}

export const schema: yup.ObjectSchema<ITemplateFormData> = yup.object().shape({
  title: yup.string().required('Title is required'),
  type: yup.string().oneOf(['text', 'text-image']).required(),
  template: yup.string().required('Template message is required'),
  campaignImage: yup
    .string()
    .url('Must be a valid URL')
    .when('type', {
      is: 'text-image',
      then: (schema) => schema.required('Image URL is required'),
      otherwise: (schema) => schema.optional().nullable(),
    }),
}) as yup.ObjectSchema<ITemplateFormData>;
