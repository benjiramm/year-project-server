import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Roles } from '@/users/schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'super_Man', description: 'Username' })
  @IsString({ message: 'Must be a string' })
  @Length(3, 30, { message: 'Must be longer than 3 and shorter than 30' })
  readonly username: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Must be a string' })
  @Length(6, 16, { message: 'Must be longer than 6 and shorter than 16' })
  readonly password: string;

  @ApiProperty({
    example: '0',
    description: '0=USER | 1=ADMIN | 2=SUPERUSER',
  })
  // @IsNumber({}, { message: 'Must Be role enum: 0 || 1 || 2' })
  readonly role: Roles;
}
