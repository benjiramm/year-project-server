import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeywordDocument = Keyword & Document;

export enum Language {
  ENGLISH = 'en',
  HEBREW = 'he',
}

@Schema()
export class Keyword {
  @Prop({ required: true, unique: true })
  keyword: string;

  @Prop({ required: true })
  meaning: string;

  @Prop({ required: true })
  language: Language;

  @Prop({ default: false })
  isAuthorized: boolean;

  @Prop({ default: [] })
  likes: [string];

  @Prop({ default: [] })
  dislikes: [string];
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
