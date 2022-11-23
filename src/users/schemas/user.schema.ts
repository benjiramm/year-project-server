import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum Roles {
  USER,
  ADMIN,
  SUPERUSER,
}

@Schema()
export class User {
  // @Prop({ type: SchemaTypes.ObjectId })
  // _id: Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
