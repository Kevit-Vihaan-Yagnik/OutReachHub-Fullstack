import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreateCampaignDto } from "./dto/createCampaign.dto";
import { AuthGaurd } from "src/auth/auth.gaurd";
import { CampaignService } from "./campaign.service";
import { WorkspaceService } from "src/workspace/workspace.service";

@Controller('campaign')
@UseGuards(AuthGaurd)
export class CampaignController {

    constructor(
        private campaignService: CampaignService,
        private workspaceService: WorkspaceService,
    ) { }

    @Post(':workspaceId')
    async createCampaign(
        @Param('workspaceId') workspaceId: string,
        @Req() req,
        @Body() body: CreateCampaignDto
    ) {
        await this.workspaceService.isUserEditor(req['user'].sub, workspaceId);
        return this.campaignService.createCampaign(workspaceId, req['user'].sub, body);
    }

    @Get(":workspaceId")
    async getAllCampaigns(@Param("workspaceId") workspaceId: string) {
        return this.campaignService.getAllCampaigns(workspaceId);
    }

    @Get("detail/:id")
    async getCampaignById(@Param("id") campaignId: string) {
        return this.campaignService.getCampaignById(campaignId);
    }

    @Patch(":id/:workspaceId")
    async updateCampaign(
        @Param("id") campaignId: string,
        @Param("workspaceId") workspaceId: string,
        @Req() req,
        @Body() body: Partial<CreateCampaignDto>
    ) {
        await this.workspaceService.isUserEditor(req["user"].sub, workspaceId);
        return this.campaignService.updateCampaign(campaignId, req["user"].sub, body);
    }

    @Delete(":id/:workspaceId")
    async deleteCampaign(
        @Param("id") campaignId: string,
        @Param("workspaceId") workspaceId: string,
        @Req() req
    ) {
        await this.workspaceService.isUserEditor(req["user"].sub, workspaceId);
        return this.campaignService.deleteCampaign(campaignId);
    }

    @Get(":workspaceId/status")
    async getCampaignsByStatus(
        @Param("workspaceId") workspaceId: string,
        @Query("status") status: string
    ) {
        return this.campaignService.getCampaignsByStatus(workspaceId, status);
    }
}   