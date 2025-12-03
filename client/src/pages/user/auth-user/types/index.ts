import * as yup from 'yup';

export interface ILoginFormData {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export const schema = yup.object().shape({
  email: yup.string().email('Invalid Email').required('Email is required'),
  password: yup
    .string()
    .min(4, 'Password must be at least 4 charcters')
    .required('Password is required'),
});
