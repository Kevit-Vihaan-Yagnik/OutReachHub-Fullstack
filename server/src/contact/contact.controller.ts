import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGaurd } from "src/auth/auth.gaurd";
import { ContactService } from "./contact.service";
import { WorkspaceService } from "src/workspace/workspace.service";
import { CreateContactsDto } from "./dto/createContact.dto";
import { Contact } from "src/schema/contact.schema";
import { UpdateContactDto } from "./dto/updateContact.dto";

@Controller('contact')
@UseGuards(AuthGaurd)
export class ContactController {
    constructor(
        private contactService: ContactService,
        private workspaceService: WorkspaceService) { }

    @Post(':workspaceId')
    async createContact(
        @Param('workspaceId') workspaceId: string,
        @Body() creatContactDto: CreateContactsDto,
        @Req() req
    ) {
        await this.workspaceService.isUserEditor(req['user'].sub, workspaceId);
        return this.contactService.createContact(workspaceId, creatContactDto, req['user'].sub);
    }

    @Post('filterTags/:workspaceId')
    async filterContacts(
        @Param('workspaceId') workspaceId : string,
        @Body('tags') tags : string[],
        @Req() req
    ){
        await this.workspaceService.validateUsers(req['user'].sub , workspaceId);
        return this.contactService.filterByTags(workspaceId,tags)
    }    
    
    @Get(':workspaceId')
    async getContactByWorkspace(
        @Param('workspaceId') workspaceId: string,
        @Req() req
    ) {
        await this.workspaceService.validateUsers(req['user'].sub, workspaceId);
        return this.contactService.getContactByWorkspace(workspaceId);
    }

    @Get(':workspaceId/:contactId')
    async getContactById(
        @Param('workspaceId') workspaceId: string,
        @Param('contactId') contactId: string,
        @Req() req
    ) {
        await this.workspaceService.validateUsers(req['user'].sub, workspaceId);
        return this.contactService.getContactById(contactId);
    }

    @Patch(':workspaceId/:contactId')
    async updateContact(
        @Param('workspaceId') workspaceId: string,
        @Param('contactId') contactId: string,
        @Body() updateData: UpdateContactDto,
        @Req() req
    ) {
        await this.workspaceService.isUserEditor(req['user'].sub, workspaceId);
        return this.contactService.updateContact(contactId, updateData);
    }

    @Delete(':workspaceId/:contactId')
    async deleteContact(
        @Param('workspaceId') workspaceId: string,
        @Param('contactId') contactId: string,
        @Req() req
    ) {
        await this.workspaceService.isUserEditor(req['user'].sub, workspaceId);
        return this.contactService.deleteContact(contactId);
    }
}   