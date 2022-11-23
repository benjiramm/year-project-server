import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperUserDto extends CreateUserDto {
  @ApiProperty({ example: 'super_Man', description: 'Username' })
  @IsNotEmpty({ message: 'Required' })
  secret: string;
}
