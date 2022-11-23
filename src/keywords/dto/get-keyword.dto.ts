import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchKeywordDto {
  @ApiProperty({ example: 'צה״ל', description: 'Keyword' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  readonly keyword: string;
}
