import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CampaignRecepientDocument = CampaignRecepient & Document;

@Schema()
export class CampaignRecepient {
  @Prop({ type: Types.ObjectId, ref: "Campaign", required: true })
  campaignId: Types.ObjectId;
    
  @Prop({ type: Types.ObjectId, ref: "Contact", required: true })
  contactId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop({
    type: String,
    enum: ["queued", "sent", "failed", "opened", "clicked"],
    default: "queued",
  })
  status: string;
}

export const CampaignRecepientSchema = SchemaFactory.createForClass(CampaignRecepient);

CampaignRecepientSchema.index({ campaignId: 1, contactId: 1 }, { unique: true });
