import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/users')
  @UseGuards(AuthGuard())
  async getAllUser(): Promise<UserEntity[]> {
    return this.authService.getAllUser();
  }

  @Get('/test')
  async test() {
    return this.authService.getAllUser();
  }
}
