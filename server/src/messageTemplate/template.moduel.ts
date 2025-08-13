import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessageTemplate, MessageTemplateSchema } from "src/schema/messageTemplate.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { Workspace, WorkspaceSchema } from "src/schema/workspace.schema";
import { MessageTemplateController } from "./template.controller";
import { MessageTemplateService } from "./template.service";
import { AuthModule } from "src/auth/auth.module";
import { WorkspaceModule } from "src/workspace/workspace.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Workspace.name, schema: WorkspaceSchema },
            { name: MessageTemplate.name, schema: MessageTemplateSchema },
            {name : User.name , schema : UserSchema},
        ]),
        AuthModule,
        WorkspaceModule
    ],
    controllers : [MessageTemplateController],
    providers : [MessageTemplateService]
})
export class MessageTemplateModule { }