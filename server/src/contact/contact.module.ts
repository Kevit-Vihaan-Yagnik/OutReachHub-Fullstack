import { Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Contact, ContactSchema } from "src/schema/contact.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { Workspace, WorkspaceSchema } from "src/schema/workspace.schema";
import { WorkspaceModule } from "src/workspace/workspace.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name : Contact.name , schema : ContactSchema},
            {name : User.name , schema : UserSchema},
            {name : Workspace.name , schema : WorkspaceSchema}
        ]),
        WorkspaceModule,
        AuthModule
    ],
    controllers : [ContactController],
    providers : [ContactService]
})
export class ContactModule{}