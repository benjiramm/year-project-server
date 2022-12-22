import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchKeywordDto {
  @ApiProperty({ example: 'צה״ל', description: 'Keyword' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  readonly keyword: string;
}

export class RankKeywordDto {
  @ApiProperty({
    example: '637ebad3b800906da0090115',
    description: 'Keyword ID',
  })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  readonly id: string;

  @ApiProperty({
    example: '637ebad3b800906da0090115',
    description: 'Language ID',
  })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  readonly langId: string;
}
