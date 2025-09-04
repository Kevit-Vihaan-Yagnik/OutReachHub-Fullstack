export interface IMessageTemplate {
    _id : string,
    workspaceId : string,
    title : string,
    type : "text" | "text-image",
    template : string,
    campaignImage? : string,
    userId : string,
    isDeleted : boolean,
    _v : number,
}
