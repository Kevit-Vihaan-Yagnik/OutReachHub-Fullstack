import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Contact extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  creator: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  profilePicture: string;

  @Prop({
    type: {
      countryCode: { type: String },
      phoneNo: { type: Number, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        match:
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      },
    },
  })
  contactInfo: {
    countryCode?: string;
    phoneNo: number;
    email: string;
  };

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
