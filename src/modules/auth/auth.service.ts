import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpDto } from './dto/verify.dto';
import { UsersService } from '@services/users/users.service';
import type { User as PrismaUser } from '@infrastructure/prisma/generated/client.js';
import { MailService } from '@infrastructure/mail/mail.service';

@Injectable()
export class AuthService {
  otpExpiresIn = 1 * 60 * 1000; // 1 minute in milliseconds
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser: PrismaUser | null =
      await this.usersService.getUserByEmail(dto.email);

    // Exit if existing user and has an active OTP that hasn't expired yet
    if (
      existingUser &&
      existingUser.otpExpiresAt &&
      existingUser.otpExpiresAt > new Date()
    ) {
      return {
        data: {
          message: 'duplicate',
          otp: existingUser.otp,
          expiresAfter: this.getOtpExpiresIn(existingUser.otpExpiresAt),
          isNewUser: !existingUser.emailVerified,
        },
      };
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date(Date.now() + this.otpExpiresIn);

    let message: string = 'generated';

    if (existingUser) {
      await this.usersService.updateUserByEmail(dto.email, {
        otp,
        otpCreatedAt: new Date(),
        otpExpiresAt: expiresAt,
      });
    } else {
      message = 'User created';
      await this.usersService.createUser(dto.email, {
        otp,
        otpCreatedAt: new Date(),
        otpExpiresAt: expiresAt,
        emailVerified: false,
      });
    }

    await this.mailService.sendFromAdminToUser(dto.email, {
      type: 'otp',
      data: {
        otp,
      },
    });

    return {
      data: {
        message: message,
        otp,
        expiresAfter: this.getOtpExpiresIn(expiresAt),
        isNewUser: !existingUser,
      },
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid email or OTP');
    }

    if (!user.otp) {
      throw new BadRequestException('No active OTP');
    }

    if (user.otp !== dto.otp) {
      throw new BadRequestException('Invalid email or OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const updatedUser = await this.usersService.updateUserById(user.id, {
      emailVerified: true,
      otp: null,
      otpCreatedAt: null,
      otpExpiresAt: null,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return {
      data: { accessToken },
    };
  }

  private getOtpExpiresIn(expiresAt: Date): number {
    const expiresAfterInSeconds = Math.floor(
      (expiresAt.getTime() - Date.now()) / 1000,
    );
    return expiresAfterInSeconds;
  }
}
