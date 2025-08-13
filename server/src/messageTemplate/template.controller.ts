import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGaurd } from "src/auth/auth.gaurd";
import { MessageTemplateService } from "./template.service";
import { WorkspaceService } from "src/workspace/workspace.service";
import { CreateTemplateDto } from "./dto/createTemplate.dto";

@Controller('messageTemplate')
@UseGuards(AuthGaurd)
export class MessageTemplateController{
    constructor(
        private templateService : MessageTemplateService,
        private workspaceService : WorkspaceService
    ){}

    @Post(':workspaceId')
    async createTemplate(
        @Body() template : CreateTemplateDto,
        @Param('workspaceId') workspaceId : string,
        @Req() req
    ){
        await this.workspaceService.isUserEditor(req['user'].sub , workspaceId);
        return this.templateService.createTemplate(workspaceId,req['user'].sub , template);
    }

    @Get(':workspace')
    async getTemplatesByWorkspace(
        @Param('workspace') workspaceId : string,
        @Req() req
    ){
        await this.workspaceService.validateUsers(req['user'].sub , workspaceId);
        return this.templateService.getTemplateByWorkspace(workspaceId);
    }

    @Delete(':workspaceId/:templateId')
    async deleteTemplate(
        @Param('templateId') templateId : string,
        @Param('workspaceId') workspaceId : string, 
        @Req() req
    ){
        await this.workspaceService.isUserEditor(req['user'].sub , workspaceId);
        return this.templateService.deleteTemplates(templateId);
    }

    @Patch(':workspaceId/:templateId')
    async updateTemplate(
        @Param('templateId') templateId : string,
        @Param('workspaceId') workspaceId : string, 
        @Body() templatedto : CreateTemplateDto,
        @Req() req
    ){
        await this.workspaceService.isUserEditor(req['user'].sub , workspaceId);
        return this.templateService.updateTemplate(templateId, templatedto);
    }
}