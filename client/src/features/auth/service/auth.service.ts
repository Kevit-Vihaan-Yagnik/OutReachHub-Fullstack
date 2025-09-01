import { post } from "@/utils/api.util";
import type { AdminResponse, LoginFormData } from "../types";

export const adminLogin = async (data: LoginFormData): Promise<AdminResponse> => {
    return await post('/auth/admin/login', data);
};