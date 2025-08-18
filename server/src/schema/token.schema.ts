import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: Date.now   , expires : '7d' })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
