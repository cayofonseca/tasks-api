import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDto) {
    return this.authService.singIn(data);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }
}
