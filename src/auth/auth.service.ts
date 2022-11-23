import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Roles } from '@/users/schemas/user.schema';
import { TokenDto } from '@/auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { CreateSuperUserDto } from '@/users/dto/create-super-user.dto';
import { UserDto } from '@/users/dto/user.dto';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { ResponseUserDto } from '@/users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createSuperUser(userDto: CreateSuperUserDto): Promise<TokenDto> {
    const isValid = userDto.secret === process.env.CREATE_SUPERUSER_SECRET;

    if (!isValid) {
      throw new HttpException('Invalid secret', HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.usersService.getUserByUserName(
      userDto.username,
    );

    if (candidate) {
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 10);

    const newUserDto: CreateUserDto = {
      username: userDto.username,
      password: hashPassword,
      role: Roles.SUPERUSER,
    };
    const user = await this.usersService.createUser(newUserDto);
    return this.generateToken(user);
  }

  async addUser(userDto: CreateUserDto): Promise<ResponseUserDto> {
    const candidate = await this.usersService.getUserByUserName(
      userDto.username,
    );

    this.validateRole(userDto.role);

    if (candidate) {
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 10);

    const newUserDto: CreateUserDto = {
      username: userDto.username,
      password: hashPassword,
      role: userDto.role,
    };

    const createdUser = await this.usersService.createUser(newUserDto);

    return {
      _id: createdUser._id,
      username: createdUser.username,
      role: createdUser.role,
    };
  }

  async login(userDto: LoginUserDto): Promise<TokenDto> {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async getUser(id: string): Promise<ResponseUserDto> {
    return await this.usersService.getUserById(id);
  }

  private async generateToken(user: UserDto): Promise<TokenDto> {
    const payload = { id: user._id, username: user.username, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private validateRole(role: number): boolean {
    const isValidRole = Object.values(Roles).includes(role);
    if (!isValidRole) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }
    return isValidRole;
  }

  private async validateUser(userDto: LoginUserDto): Promise<UserDto> {
    const user = await this.usersService.getUserByUserName(userDto.username);

    if (!user) {
      throw new UnauthorizedException({ message: 'User not exists' });
    }

    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!isPasswordEquals) {
      throw new UnauthorizedException({
        message: 'Invalid username or password',
      });
    }
    return user;
  }
}
