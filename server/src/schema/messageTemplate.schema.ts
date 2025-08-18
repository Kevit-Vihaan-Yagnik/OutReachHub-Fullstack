import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class MessageTemplate{

    @Prop({type : Types.ObjectId , ref : 'Workspace' , required : true})
    workspaceId : Types.ObjectId;

    @Prop({required : true})
    title : string;

    @Prop({required : false , enum : ['text' , 'text-image'] , default : 'text'})
    type? : string;

    @Prop({required : true})
    template : string;

    @Prop({required : false})
    campaignImage? : string;

    @Prop({required : true , type : Types.ObjectId , ref : 'User'})
    userId : Types.ObjectId;

    @Prop({required : false , default : false})
    isDeleted : boolean;
}

export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate);