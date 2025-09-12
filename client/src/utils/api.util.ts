import { store } from "@/app/store";
import {
  userLogout,
  userSetTokens,
} from "@/features/user/auth-user/slices/userAuthSlice";
import { logout, setTokens } from "@/features/admin/auth/slices/adminAuthSlice";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// Base URL for API (configurable based on environment)
const BASE_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
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

//Queue to handle multiple failing api endpoint
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const adminRefresh = state.adminAuth.admin?.refresh_token;
      const userRefresh = state.userAuth.user?.refresh_token;

      if (!adminRefresh && !userRefresh) {
        store.dispatch(logout());
        store.dispatch(userLogout());
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // push this request into queue and wait
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${BASE_URL}/auth/user/refresh`, {
          refreshToken: userRefresh ?? adminRefresh,
        });

        const { access_token, refresh_token } = res.data;
        if (userRefresh) {
          store.dispatch(userSetTokens({ access_token, refresh_token }));
        } else {
          store.dispatch(setTokens({ access_token, refresh_token }));
        }

        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        store.dispatch(userLogout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Generic types for API responses
export type ApiResponse<T> = T;

// Generic GET request
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic POST request
export const post = async <T, B>(
  url: string,
  data: B,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(
      url,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic PUT request
export const patch = async <T, B>(
  url: string,
  data: B,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.patch(
      url,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Generic DELETE request
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(
      url,
      config
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Error handling function
const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return new Error(axiosError.message || "An error occurred");
  }
  return new Error("An unexpected error occurred");
};
