import { Type } from "@nestjs/common";
import { Prop , Schema, SchemaFactory} from "@nestjs/mongoose";
import { Types ,Schema as MongooseSchema } from "mongoose";

@Schema()
export class Workspace{

    @Prop({type : MongooseSchema.Types.ObjectId , ref : 'Admin'})
    creator : Types.ObjectId;

    @Prop({required : true})
    name : string;

    @Prop({required : false})
    description? : string;

    @Prop({default : []})
    tags : string[];

    @Prop({default : Date.now})
    creationDate : Date;

    @Prop({type : [MongooseSchema.Types.ObjectId] , ref:'User' , default : []})
    users : [Types.ObjectId];

    @Prop({type : [MongooseSchema.Types.ObjectId] , ref:'User' , default : []})
    campaigns : [Types.ObjectId]
}

export const WorkspaceSchema =  SchemaFactory.createForClass(Workspace);