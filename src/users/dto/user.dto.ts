import { Types } from 'mongoose';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends CreateUserDto {
  @ApiProperty({ example: '_id', description: '637e84180995cc3c214a0233' })
  readonly _id: Types.ObjectId;
}
