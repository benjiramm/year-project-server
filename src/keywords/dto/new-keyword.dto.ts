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

  @ApiProperty({
    example: [
      '637e946ef090a9bc474f62cb',
      '637e84180995cc3c214a0233',
      '637e8c2ab1cc2803dd7c8f13',
    ],
    description: 'Likes',
  })
  likes: Array<string>;

  @ApiProperty({
    example: ['637e8d5843b31a457bbac2b2'],
    description: 'Dislikes',
  })
  dislikes: Array<string>;
}

export class ResponseKeywordDto extends NewKeywordDto {
  @ApiProperty({ example: '_id', description: '637e84180995cc3c214a0233' })
  readonly _id: Types.ObjectId;
}
