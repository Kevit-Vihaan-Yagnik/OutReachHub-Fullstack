import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGaurd } from "src/auth/auth.gaurd";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/createWorkspace.dto";

@Controller('workspace')
@UseGuards(AuthGaurd)
export class WorkspaceController{   
    constructor(private workspaceService : WorkspaceService){}

    @Post()
    async createWorkspace(@Body() createWorkspaceDto : CreateWorkspaceDto , @Req() req){
        await this.workspaceService.validateAdmin(req['admin'].sub);
        const adminID = req['admin'].sub
        return this.workspaceService.createWorkspace(createWorkspaceDto , adminID)
    }

    @Get()
    async getWorkspaces(@Req() req){
        await this.workspaceService.validateAdmin(req['admin'].sub);
        return this.workspaceService.getWorkspace()
    }

    @Get(':id')
    async getWokspacesByID(@Req() req , @Param('id') id:string){
        await this.workspaceService.validateUsers(req['users'] , id);
        return this.workspaceService.getWorkspaceById(id);
    }

    
}
