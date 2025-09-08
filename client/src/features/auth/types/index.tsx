import * as yup from 'yup';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AdminResponse {
    id : string;
    email : string;
    access_token : string;
    refresh_token : string;
}

export const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });