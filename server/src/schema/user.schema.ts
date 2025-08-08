import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Permission {
  @Prop({ default: false })
  allowAdd: boolean;

  @Prop({ default: false })
  write: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

@Schema()
export class WorkspacePermission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: PermissionSchema, required: true })
  permission: Permission;
}

export const WorkspacePermissionSchema = SchemaFactory.createForClass(WorkspacePermission);

@Schema()
export class ContactInfo {
  @Prop()
  countryCode: string;

  @Prop({ required: true })
  phoneNo: number;

  @Prop({
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  })
  email: string;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @IsOptional()
  avatarUrl? : string

  @Prop({ type: ContactInfoSchema, required: true })
  contactInfo: ContactInfo;

  @Prop({ type: [WorkspacePermissionSchema], default: [] })
  workspaces: WorkspacePermission[];

  @Prop({ default: Date.now })
  joinDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
