import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class Campaign {
  @Prop({ type: Types.ObjectId, ref: "Workspace", required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  creator: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "MessageTemplate", required: true })
  templateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  lastModifiedBy: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: String,
    enum: ["Draft", "Running", "Completed"],
    default: "Draft",
  })
  status: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
