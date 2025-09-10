import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Workspace } from 'src/schema/workspace.schema';
import { CreateWorkspaceDto } from './dto/createWorkspace.dto';
import { User } from 'src/schema/user.schema';
import { Admin } from 'src/schema/admin.schema';
import { AddMembersDto, MemberPermissionsDto } from './dto/add-member.dto';
import { UpdateWorkspaceDto } from './dto/updateWorkspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private WorkspaceModel: Model<Workspace>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Admin.name) private AdminModel: Model<Admin>,
  ) {}

  async validateUsers(userId: string, workspaceId: string) {
    const user = await this.UserModel.findOne({
      _id: userId,
      workspaces: {
        $elemMatch: {
          workspaceId: new Types.ObjectId(workspaceId),
          'permission.viewer': true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('You are not a member of this Workspace');
    }

    return user;
  }

  async isUserEditor(userId: string, workspaceId: string) {
    const user = await this.UserModel.findOne({
      _id: userId,
      workspaces: {
        $elemMatch: {
          workspaceId: new Types.ObjectId(workspaceId),
          'permission.viewer': true,
          'permission.editor': true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('You are not allowed to add contacts');
    }

    return user;
  }
  async validateRequesterPermission(requester: any, workspaceId: string) {
    if (requester.isAdmin) {
      const admin = await this.AdminModel.findById(requester.sub);
      if (!admin) {
        throw new UnauthorizedException('Admin not found.');
      }
      return;
    }

    const user = await this.UserModel.findOne({
      _id: requester.sub,
      workspaces: {
        $elemMatch: {
          workspaceId: new Types.ObjectId(workspaceId),
          'permission.viewer': true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'You are not a member of this workspace.',
      );
    }

    // You can still get the specific workspace permissions if needed
    const workspacePermission = user.workspaces.find(
      (ws) => ws.workspaceId.toString() === workspaceId,
    );

    return workspacePermission;
  }

  async validateAdmin(adminId: string) {
    const admin = await this.AdminModel.findById(adminId);

    if (!admin) throw new UnauthorizedException('You are not an admin');

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

  async editWorkspace(id: string, dto: UpdateWorkspaceDto) {
    const workspace = await this.WorkspaceModel.findByIdAndUpdate(id, {
      name: dto.name,
      description: dto.description,
    });

    return {
      message: `name : ${workspace!.name} and description ${workspace?.description} updated`,
    };
  }

  async addMembers(workspaceId: string, addMembersDto: AddMembersDto) {
    const { members } = addMembersDto;
    const workspace = await this.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new HttpException('Workspace not found', 404);
    }

    // Only use email for user lookup, create new users with random password if not found
    const userOps = members.map(async (member) => {
      const { name, avatarUrl, contactInfo, permissions } = member;
      if (!name || !contactInfo || !contactInfo.email || !contactInfo.phoneNo) {
        throw new HttpException(
          'Missing user info (name, email, phoneNo) for member',
          400,
        );
      }
      // Check if user exists by email
      let user = await this.UserModel.findOne({
        'contactInfo.email': contactInfo.email,
      });
      if (user) {
        // If already a member, skip or throw
        if (
          user.workspaces.some(
            (ws) => ws.workspaceId.toString() === workspaceId,
          )
        ) {
          throw new HttpException(
            `User already a member: ${user.contactInfo.email}`,
            409,
          );
        }
        user.workspaces.push({
          workspaceId: new Types.ObjectId(workspaceId),
          permission: { ...permissions, viewer: permissions.viewer ?? true },
        });
        await user.save();
      } else {
        // Generate random password
        const randomPassword = 'user@123';
        const hash = await bcrypt.hash(randomPassword, 10);
        const newUser = new this.UserModel({
          name,
          password: hash,
          avatarUrl,
          contactInfo,
          workspaces: [
            {
              workspaceId: new Types.ObjectId(workspaceId),
              permission: {
                ...permissions,
                viewer: permissions.viewer ?? true,
              },
            },
          ],
        });
        await newUser.save();
        user = newUser;
      }
      // Add user to workspace.users if not already present
      if (!workspace.users.some((u) => u.toString() === user._id.toString())) {
        workspace.users.push(user._id as Types.ObjectId);
      }
    });

    await Promise.all(userOps);
    await workspace.save();

    return { message: `${members.length} member(s) processed successfully.` };
  }

  async editUserPermissions(
    workspaceId: string,
    userId: string,
    dto: MemberPermissionsDto,
  ) {
    const workspace = await this.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new HttpException('Workspace not found', 404);
    }

    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const wsEntry = user.workspaces.find(
      (w) => w.workspaceId.toString() === workspaceId,
    );
    if (!wsEntry) {
      throw new HttpException('User is not part of this workspace', 400);
    }

    wsEntry.permission = {
      ...wsEntry.permission,
      ...dto,
    };

    await user.save();

    return {
      message: 'User permissions updated successfully',
      userId: user._id,
      workspaceId,
      permissions: wsEntry.permission,
    };
  }

  async deleteMember(userId: string, workspaceId: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const usrWsPermission = user.workspaces.find(
      (ws) => ws.workspaceId.toString() === workspaceId,
    );
    if (!usrWsPermission) {
      throw new HttpException('User is not a member of this workspace', 404);
    }

    usrWsPermission.permission.viewer = false;
    await user.save();
    return { message: `User ${userId} deleted from workspace ${workspaceId}` };
  }

  async addTags(workspaceId: string, tags: string[]) {
    const workspace = await this.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new HttpException('Workspace not found', 404);
    }

    const tagsToAdd = tags.filter((tag) => !workspace.tags.includes(tag));
    if (tagsToAdd.length > 0) {
      workspace.tags.push(...tagsToAdd);
      await workspace.save();
    }
    return {
      message: `${tagsToAdd.length} new tag(s) added.`,
      tags: workspace.tags,
    };
  }

  async deleteTags(workspaceId: string, tags: string[]) {
    const workspace = await this.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new HttpException('Workspace not found', 404);
    }

    const tagsToRemove = tags.filter((tag) => workspace.tags.includes(tag));
    if (tagsToRemove.length > 0) {
      workspace.tags = workspace.tags.filter(
        (tag) => !tagsToRemove.includes(tag),
      );
      await workspace.save();
    }
    return {
      message: `${tagsToRemove.length} tag(s) removed.`,
      tags: workspace.tags,
    };
  }
}
