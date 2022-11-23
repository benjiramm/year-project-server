import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Roles } from '@/users/schemas/user.schema';

export class ResponseUserDto {
  @ApiProperty({ example: '_id', description: '637e84180995cc3c214a0233' })
  readonly _id: Types.ObjectId;

  @ApiProperty({ example: 'super_Man', description: 'Username' })
  readonly username: string;

  @ApiProperty({
    example: '0',
    description: '0=USER | 1=ADMIN | 2=SUPERUSER',
  })
  readonly role: Roles;
}
