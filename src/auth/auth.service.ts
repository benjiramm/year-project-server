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
    // Check if secret key is correct
    const isValid = userDto.secret === process.env.CREATE_SUPERUSER_SECRET;

    if (!isValid) {
      throw new HttpException('Invalid secret', HttpStatus.BAD_REQUEST);
    }

    // Check if user with that username already exists
    const candidate = await this.usersService.getUserByUserName(
      userDto.username,
    );

    // If user exists, throw an error
    if (candidate) {
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    const hashPassword = await bcrypt.hash(userDto.password, 10);

    // Create new user DTO
    const newUserDto: CreateUserDto = {
      username: userDto.username,
      password: hashPassword,
      role: Roles.SUPERUSER,
    };

    // Call service to create new user
    const user = await this.usersService.createUser(newUserDto);
    return this.generateToken(user);
  }

  async addUser(userDto: CreateUserDto): Promise<ResponseUserDto> {
    // Check if user with that username already exists
    const candidate = await this.usersService.getUserByUserName(
      userDto.username,
    );

    // role validation
    this.validateRole(userDto.role);

    // If user exists, throw an error
    if (candidate) {
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    const hashPassword = await bcrypt.hash(userDto.password, 10);

    // Create new user DTO
    const newUserDto: CreateUserDto = {
      username: userDto.username,
      password: hashPassword,
      role: userDto.role,
    };

    // Call service to create new user
    const createdUser = await this.usersService.createUser(newUserDto);

    // Return without password
    return {
      _id: createdUser._id,
      username: createdUser.username,
      role: createdUser.role,
    };
  }

  async login(userDto: LoginUserDto): Promise<TokenDto> {
    // Validate user
    const user = await this.validateUser(userDto);

    // Generate token
    return this.generateToken(user);
  }

  async getUser(id: string): Promise<ResponseUserDto> {
    // Call service to Get user from DB
    return await this.usersService.getUserById(id);
  }

  // Token generator
  private async generateToken(user: UserDto): Promise<TokenDto> {
    const payload = { id: user._id, username: user.username, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // Role validator
  private validateRole(role: number): boolean {
    const isValidRole = Object.values(Roles).includes(role);
    if (!isValidRole) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }
    return isValidRole;
  }

  // User validator
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
