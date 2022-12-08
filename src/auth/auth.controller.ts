import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TokenDto } from '@/auth/dto/auth.dto';
import { CreateSuperUserDto } from '@/users/dto/create-super-user.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { JwtAuthGuard, SuperUserGuard } from '@/auth/jwt-auth.guard';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { ResponseUserDto } from '@/users/dto/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-super-user')
  @ApiOperation({ summary: 'Register Super-User' })
  @ApiResponse({ status: 200, type: TokenDto })
  registration(@Body() userDto: CreateSuperUserDto) {
    return this.authService.createSuperUser(userDto);
  }

  @Post('add-user')
  @ApiOperation({ summary: 'Add User With Super-User' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(SuperUserGuard)
  @ApiResponse({ status: 200, type: ResponseUserDto })
  addUser(@Body() userDto: CreateUserDto) {
    return this.authService.addUser(userDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: TokenDto })
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, type: TokenDto })
  register(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Get('get-user')
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @UseGuards(JwtAuthGuard)
  getUser(@Req() req) {
    return this.authService.getUser(req.user.id);
  }
}
