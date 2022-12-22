import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type KeywordDocument = Keyword & Document;

export enum Language {
  ENGLISH = 'en',
  HEBREW = 'he',
  ARABIC = 'ar',
}

export const defaultKeywordValue: IKeyword = {
  keyword: null,
  short: null,
  long: null,
  isAuthorized: false,
  likes: [],
  dislikes: [],
  // _id: null,
};

@Schema()
export class IKeyword {
  @Prop({
    type: String || null,
    default: defaultKeywordValue.keyword,
  })
  keyword: string;

  @Prop({
    type: String || null,
    default: defaultKeywordValue.short,
  })
  short: string;

  @Prop({
    type: String || null,
    default: defaultKeywordValue.long,
  })
  long: string;

  @Prop({ default: false })
  isAuthorized: boolean;

  @Prop({ default: [], type: [String] })
  likes: Array<string>;

  @Prop({ default: [], type: [String] })
  dislikes: Array<string>;

  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id?: ObjectId;
}

@Schema()
export class Keyword {
  @ApiProperty({
    example: {
      keyword: 'מדא',
      short: 'קצר',
      long: 'ארוך',
      isAuthorized: false,
      likes: [],
      dislikes: [],
      _id: '5f9f1b9c0b9b9c0b9b9b9b9b',
    },
  })
  @Prop({ type: IKeyword, default: defaultKeywordValue })
  he: IKeyword;

  @ApiProperty({
    example: {
      keyword: 'mada',
      short: 'short',
      long: 'long',
      isAuthorized: false,
      likes: [],
      dislikes: [],
      _id: '5f9f1b9c0b9b9c0b9b9b9b9c',
    },
  })
  @Prop({ type: IKeyword, default: defaultKeywordValue })
  en: IKeyword;

  @ApiProperty({
    example: {
      keyword: 'مدى',
      short: 'قصير',
      long: 'طويل',
      isAuthorized: false,
      likes: [],
      dislikes: [],
      _id: '5f9f1b9c0b9b9c0b9b9b9b9d',
    },
  })
  @Prop({ type: IKeyword, default: defaultKeywordValue })
  ar: IKeyword;

  @ApiProperty({
    example: '5f9f1b9aase9b92342',
  })
  _id: ObjectId;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
