import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContactInfo {
  @Prop()
  countryCode: string;

  @Prop({ required: true })
  phoneNo: number;

  @Prop({
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  })
  email: string;
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: ContactInfo })
  contactInfo: ContactInfo;

  @Prop({ default: Date.now })
  joinDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
