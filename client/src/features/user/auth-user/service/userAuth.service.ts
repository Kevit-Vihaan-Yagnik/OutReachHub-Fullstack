import { post } from "@/utils/api.util"
import type { ILoginFormData, IUserResponse } from "../types"

// User Login Api
export const userLoginApi = async (data: ILoginFormData): Promise<IUserResponse> => {
    return await post('/auth/user/login', data);
}

//User Logout Api
export const userLogoutApi = async (data : {userId : string}) => {
    return await post('/auth/user/logout' , data);
}