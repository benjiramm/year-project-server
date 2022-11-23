import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSuperUserDto extends CreateUserDto {
  @ApiProperty({ example: 'my_secret', description: 'Secret Key' })
  @IsNotEmpty({ message: 'Required' })
  secret: string;
}
