import { IKeyword } from '@/keywords/schemas/keyword.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class NewKeywordDto {
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
  ar: IKeyword;
}

export class ResponseKeywordDto extends NewKeywordDto {
  @ApiProperty({ example: '637e84180995cc3c214a0233' })
  readonly _id: Types.ObjectId;
}
