import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({ summary: 'Đăng nhập' })
  // @ApiBody({ type: LoginDto })
  // @Post('login')
  // @UseGuards(LocalAuthGuard)
  // async login(@Request() request: ExpressRequest) {
  //   return this.authService.login(request.user);
  // }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Đăng nhập' })
  // @ApiBody({ type: LoginDto })
  // @Post('signIn')
  // signIn(@Body() LoginDto: LoginDto) {
  //   return this.authService.signIn(LoginDto);
  // }
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @Post('/login')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Post('/refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
