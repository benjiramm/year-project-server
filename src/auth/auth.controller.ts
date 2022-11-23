import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDto } from '@/auth/dto/auth.dto';
import { CreateSuperUserDto } from '@/users/dto/create-super-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-super-user')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: TokenDto })
  registration(@Body() userDto: CreateSuperUserDto) {
    return this.authService.createSuperUser(userDto);
  }
}
