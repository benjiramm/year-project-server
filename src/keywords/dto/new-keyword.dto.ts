import { IKeyword } from '@/keywords/schemas/keyword.schema';
import { ApiProperty } from '@nestjs/swagger';

export class NewKeywordDto {
  @ApiProperty({
    example: {
      keyword: 'מדא',
      short: 'קצר',
      long: 'ארוך',
    },
  })
  he: IKeyword;
  @ApiProperty({
    example: {
      keyword: 'mada',
      short: 'short',
      long: 'long',
    },
  })
  en: IKeyword;
  @ApiProperty({
    example: {
      keyword: 'مدى',
      short: 'قصير',
      long: 'طويل',
    },
  })
  ar: IKeyword;
}
