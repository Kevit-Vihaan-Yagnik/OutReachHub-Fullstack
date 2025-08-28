import axios, {AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse} from 'axios';

// Base URL for API (configurable based on environment)
const BASE_URL = import.meta.env.BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication or other headers (e.g., token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Example: Retrieve token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Generic types for API responses
export type ApiResponse<T> = T;

// Generic GET request
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic POST request
export const post = async <T, B>(url: string, data: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic PUT request
export const put = async <T, B>(url: string, data: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Error handling function
const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return new Error(axiosError.message || 'An error occurred');
  }
  return new Error('An unexpected error occurred');
};
