import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageTemplate } from "src/schema/messageTemplate.schema";
import { User } from "src/schema/user.schema";
import { Workspace } from "src/schema/workspace.schema";
import { CreateTemplateDto } from "./dto/createTemplate.dto";

@Injectable()
export class MessageTemplateService {

    constructor(
        @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>,
        @InjectModel(User.name) private UserModel : Model<User>,
        @InjectModel(MessageTemplate.name) private MessageTemplateModel : Model<MessageTemplate>
    ) { }

    async verifyWorkspace(workspaceId : string){
        const workspace = this.WorkspaceModel.findById(workspaceId);

        if(!workspace) throw new HttpException('Workspace not found' , 404);
        
        return workspace;
    }

    async createTemplate(workspaceId: string, userId: string , dto : CreateTemplateDto) {
        const workspace = await this.WorkspaceModel.findById(workspaceId);

        if(!workspace) throw new HttpException('Workspace not found' , 404);

        const newTemplate = await this.MessageTemplateModel.insertOne({
            ...dto,
            workspaceId : workspaceId,
            userId : userId
        }).catch((err)=>{
            throw new HttpException(err , 409);
        })

        return newTemplate;
    }

    async getTemplateByWorkspace(workspaceId : string){
        const templates =  this.MessageTemplateModel.find({
            workspaceId : workspaceId,
            isDeleted : false
        });

        return templates;
    }

    async deleteTemplates(templateId : string){
        const template = await this.MessageTemplateModel.findByIdAndUpdate(templateId , {
            isDeleted : true
        });

        return {message : `${template?.title} deleted successfuly`}
    }

    // async updateTemplate(templateId : string , dto : CreateTemplateDto){
    //     const template = await this.MessageTemplateModel.findByIdAndUpdate(templateId , {
    //         ...dto
    //     },{new : true})

    //     return template
    // }
}