import { Language } from '@/keywords/schemas/keyword.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class NewKeywordDto {
  @ApiProperty({ example: 'צה״ל', description: 'Keyword' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Required' })
  keyword: string;

  @ApiProperty({ example: 'צבא ההגנה לישראל', description: 'Meaning' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Required' })
  meaning: string;

  @ApiProperty({ example: Language.HEBREW, description: 'Language' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Required' })
  language: Language;

  @ApiProperty({ example: true, description: 'Is Authorized' })
  isAuthorized: boolean;

  @ApiProperty({ example: 100, description: 'Likes' })
  likes: number;

  @ApiProperty({ example: 0, description: 'Dislikes' })
  dislikes: number;
}

export class ResponseKeywordDto extends NewKeywordDto {
  @ApiProperty({ example: '_id', description: '637e84180995cc3c214a0233' })
  readonly _id: Types.ObjectId;
}
