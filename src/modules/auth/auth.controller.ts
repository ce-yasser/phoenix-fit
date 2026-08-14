import {
  Body,
  Controller,
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from '@interfaces';
import { CurrentUser } from '@decorators/current-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @SetMetadata('no_name', true)
  register(@CurrentUser() user: JwtPayload, @Body() dto: RegisterDto) {
    if (!user) {
      // throw unauthorized exception if user is not authenticated
      throw new UnauthorizedException();
    }
    return this.authService.register(user.sub, dto.name);
  }
}
