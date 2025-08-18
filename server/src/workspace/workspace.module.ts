import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "src/schema/workspace.schema";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { AuthModule } from "src/auth/auth.module";
import { User, UserSchema } from "src/schema/user.schema";
import { Admin, AdminSchema } from "src/schema/admin.schema";
import { Token, TokenSchema } from "src/schema/token.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Workspace.name, schema: WorkspaceSchema },
            { name: User.name, schema: UserSchema },
            { name: Admin.name, schema: AdminSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
        AuthModule,
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [WorkspaceService]
})
export class WorkspaceModule { }