import { get } from "@/utils/api.util"
import type { IMessageTemplate } from "../types"

export const getMessageTemplatesApi = async (workspaceId : string) : Promise<IMessageTemplate[]> => {
    return await get(`/messageTemplate/${workspaceId}`)
}