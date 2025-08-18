import { HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign } from "src/schema/campaign.schema";
import { User } from "src/schema/user.schema";
import { Workspace } from "src/schema/workspace.schema";
import { CreateCampaignDto } from "./dto/createCampaign.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CampaignService {
    constructor(
        @InjectModel(Campaign.name) private CampaignModel: Model<Campaign>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>
    ) { }

    async createCampaign(workspaceId: string, userId: string, dto: CreateCampaignDto) {
        const workspace = await this.WorkspaceModel.findById(workspaceId);

        if (!workspace) throw new HttpException("Workspace not found", 404);

        const addedTags = dto.tags;
        const validTags = workspace.tags.filter((t) => addedTags?.includes(t));

        if (!validTags) throw new HttpException("No valid tags were given", 400)

        const newCampaign = await this.CampaignModel.insertOne({
            ...dto,
            workspaceId: workspaceId,
            creator: userId,
            lastModifiedBy: userId,
            tags: validTags
        })

        return newCampaign;
    }

    async getAllCampaigns(workspaceId: string) {
        await this.updateCampaignStatuses();
        return this.CampaignModel.find({ workspaceId, isDeleted: false });
    }

    async getCampaignById(campaignId: string) {
        const campaign = await this.CampaignModel.findOne({
            _id: campaignId,
            isDeleted: false,
        })
            .populate("templateId")
            .populate("creator", "contactInfo.email")
            .populate("lastModifiedBy", "contactInfo.email");

        if (!campaign) throw new NotFoundException("Campaign not found");
        return campaign;
    }

    async updateCampaign(campaignId: string, userId: string, dto: Partial<CreateCampaignDto>) {
        const updated = await this.CampaignModel.findOneAndUpdate(
            { _id: campaignId, isDeleted: false },
            { ...dto, lastModifiedBy: userId },
            { new: true }
        );

        if (!updated) throw new NotFoundException("Campaign not found or deleted");
        return updated;
    }

    async deleteCampaign(campaignId: string) {
        const deleted = await this.CampaignModel.findOneAndUpdate(
            { _id: campaignId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!deleted) throw new NotFoundException("Campaign not found or already deleted");
        return { message: "Campaign deleted successfully", campaign: deleted };
    }

    async getCampaignsByStatus(workspaceId: string, status: string) {
        return this.CampaignModel.find({
            workspaceId,
            status,
            isDeleted: false,
        });
    }

    @Cron(CronExpression.EVERY_HOUR)
    async updateCampaignStatuses(){
        const now = new Date();

        await this.CampaignModel.updateMany(
            {status : 'Draft' , startDate : {$lte : now}},
            {$set : {status : 'Running'}}
        )   

        await this.CampaignModel.updateMany(
            {status : 'Running' , endDate : {$lte : now}},
            {$set : { status : 'Completed'}}
        )
    }
}