import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserDto } from '@/users/dto/user.dto';
import { ResponseUserDto } from '@/users/dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<UserDto> {
    return await new this.model(userDto).save();
  }

  async getUserByUserName(username: string): Promise<UserDto> {
    return await this.model.findOne({ username }).exec();
  }

  async getUserById(id: string): Promise<ResponseUserDto> {
    return await this.model.findById(id).select('-password').exec();
  }
}
