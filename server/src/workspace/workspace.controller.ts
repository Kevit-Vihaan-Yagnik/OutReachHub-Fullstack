import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGaurd } from "src/auth/auth.gaurd";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/createWorkspace.dto";
import { AddMembersDto } from "./dto/add-member.dto";
import { UpdateWorkspaceDto } from "./dto/updateWorkspace.dto";

@Controller('workspace')
@UseGuards(AuthGaurd)
export class WorkspaceController {
    constructor(private workspaceService: WorkspaceService) { }

    @Post()
    async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto, @Req() req) {
        await this.workspaceService.validateAdmin(req['admin'].sub);
        const adminID = req['admin'].sub
        return this.workspaceService.createWorkspace(createWorkspaceDto, adminID)
    }

    @Get()
    async getWorkspaces(@Req() req) {
        await this.workspaceService.validateAdmin(req['admin'].sub);
        return this.workspaceService.getWorkspace()
    }

    @Get(':id')
    async getWokspacesByID(@Req() req, @Param('id') id: string) {
        const requester = req.admin|| req.user
        await this.workspaceService.validateRequesterPermission(requester, id)
        return this.workspaceService.getWorkspaceById(id);
    }

    @Patch(':id')
    async editWorkspace(
        @Req() req,
        @Body() editWorkspaceDto : UpdateWorkspaceDto,
        @Param('id') workspaceId : string
    ) {
        const requester = req.admin|| req.user
        await this.workspaceService.validateRequesterPermission(requester , workspaceId)
        return this.workspaceService.editWorkspace(workspaceId , editWorkspaceDto);
    }

    @Post(':id/members')
    async addMembers(
        @Param('id') workspaceId: string,
        @Body() addMembersDto: AddMembersDto,
        @Req() req: any,
    ) {
        const requester = req.admin || req.user;
        await this.workspaceService.validateRequesterPermission(requester, workspaceId);
        return this.workspaceService.addMembers(workspaceId, addMembersDto);
    }

    @Delete(':id/members/:userId')
    async deleteMember(
        @Param('id') workspaceId: string,
        @Param('userId') userId: string,
        @Req() req: any,
    ) {
        const requester = req.admin || req.user;
        await this.workspaceService.validateRequesterPermission(requester, workspaceId);
        return this.workspaceService.deleteMember(userId, workspaceId);
    }

    @Post(':id/tags')
    async addTags(
        @Param('id') workspaceId: string,
        @Body() body: { tags: string[] },
        @Req() req
    ) {
        const requester = req.admin || req.user;
        await this.workspaceService.validateRequesterPermission(requester, workspaceId);
        return this.workspaceService.addTags(workspaceId, body.tags);
    }

    @Post(':id/delete/tags')
    async deleteTags(
        @Param('id') workspaceId: string,
        @Body() body: { tags: string[] },
        @Req() req
    ) {
        const requester = req.admin || req.user;
        await this.workspaceService.validateRequesterPermission(requester, workspaceId);
        return this.workspaceService.deleteTags(workspaceId, body.tags);
    }
}
