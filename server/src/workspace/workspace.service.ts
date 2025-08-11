import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Workspace } from "src/schema/workspace.schema";
import { CreateWorkspaceDto } from "./dto/createWorkspace.dto";
import { User } from "src/schema/user.schema";
import { Admin } from "src/schema/admin.schema";
import { AddMemberDto } from "./dto/add-member.dto";

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Admin.name) private AdminModel : Model<Admin>
    ) { }

    async validateUsers(userId: string, workspaceId: string) {
        const user = await this.UserModel.findOne({ 
            _id: userId,
            'workspaces.workspaceId': workspaceId,
        });

        if (!user) {
            throw new UnauthorizedException('You are not a member of this Workspace');
        }

        return user;
    }

    async validateAdmin(adminId : string){
        const admin = await this.AdminModel.findById(adminId);
        
        if(!admin) throw new UnauthorizedException("You are not an admin");

        return admin;
    }

    async createWorkspace(dto: CreateWorkspaceDto, adminID: string) {
        const newWorkspace = new this.WorkspaceModel({
            ...dto,
            creator: adminID,
        });
        return await newWorkspace.save();
    }

    async getWorkspace() {
        return this.WorkspaceModel.find();
    }

    async getWorkspaceById(id: string) {
        const workspace = await this.WorkspaceModel.findById(id)
            .populate('users')
            .populate('campaigns')
            .exec();

        if (!workspace) {
            throw new HttpException('Workspace Id Invalid', 404);
        }
        return workspace;
    }
}