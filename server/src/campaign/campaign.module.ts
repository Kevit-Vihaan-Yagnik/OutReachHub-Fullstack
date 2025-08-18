import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { Campaign, CampaignSchema } from "src/schema/campaign.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { Workspace, WorkspaceSchema } from "src/schema/workspace.schema";
import { AuthModule } from "src/auth/auth.module";
import { WorkspaceModule } from "src/workspace/workspace.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            { name: Campaign.name, schema: CampaignSchema },
            { name: User.name, schema: UserSchema },
            { name: Workspace.name, schema: WorkspaceSchema },
        ]),
        AuthModule,
        WorkspaceModule
    ],
    controllers: [CampaignController],
    providers: [CampaignService],
})
export class CampaignModule {}
