import { store } from '@/app/store';
import { userLogout, userSetTokens } from '@/features/auth-user/slices/userAuthSlice';
import { logout, setTokens } from '@/features/auth/slices/adminAuthSlice';
import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';


// Base URL for API (configurable based on environment)
const BASE_URL = import.meta.env.VITE_API_URL;

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
    const state = store.getState();
    const adminToken = state.adminAuth.admin?.access_token;
    const userToken = state.userAuth.user?.access_token;

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Response interceptor → handle token refresh for both admin & user
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const state = store.getState();

      const adminRefresh = state.adminAuth.admin?.refresh_token;
      const userRefresh = state.userAuth.user?.refresh_token;

      // ---- Handle Admin refresh ----
      if (adminRefresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: adminRefresh,
          });

          const { access_token, refresh_token } = res.data;

          store.dispatch(
            setTokens({ access_token, refresh_token })
          );

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${access_token}`;
            return api.request(error.config);
          }
        } catch {
          store.dispatch(logout());
        }
      }

      // ---- Handle User refresh ----
      else if (userRefresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: userRefresh,
          });

          const { access_token, refresh_token } = res.data;

          store.dispatch(
            userSetTokens({ access_token, refresh_token })
          );

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${access_token}`;
            return api.request(error.config);
          }
        } catch {
          store.dispatch(userLogout());
        }
      }

      // No refresh token → force logout
      else {
        store.dispatch(logout());
        store.dispatch(userLogout());
      }
    }

    return Promise.reject(error);
  }
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
export const patch = async <T, B>(url: string, data: B, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.patch(url, data, config);
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
