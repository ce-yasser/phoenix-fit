import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  otpExpiresIn = 1 * 60 * 1000; // 1 minute in milliseconds
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Exit if existing user and has an active OTP that hasn't expired yet
    if (
      existingUser &&
      existingUser.otpExpiresAt &&
      existingUser.otpExpiresAt > new Date()
    ) {
      return {
        message: 'duplicate',
        otp: existingUser.otp,
        expiresAfter: this.getOtpExpiresIn(existingUser.otpExpiresAt),
        isNewUser: !existingUser.emailVerified,
      };
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date(Date.now() + this.otpExpiresIn);

    let message: string = 'generated';

    if (existingUser) {
      await this.prisma.user.update({
        where: {
          email: dto.email,
        },
        data: {
          otp,
          otpCreatedAt: new Date(),
          otpExpiresAt: expiresAt,
        },
      });
    } else {
      message = 'User created';
      await this.prisma.user.create({
        data: {
          email: dto.email,
          otp,
          otpCreatedAt: new Date(),
          otpExpiresAt: expiresAt,
          emailVerified: false,
        },
      });
    }

    return {
      message: message,
      otp,
      expiresAfter: this.getOtpExpiresIn(expiresAt),
      isNewUser: !existingUser,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

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

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        otp: null,
        otpCreatedAt: null,
        otpExpiresAt: null,
      },
    });

    const token = await this.jwtService.signAsync({
      sub: updatedUser.id,
      email: updatedUser.email,
    });

    return {
      accessToken: token,
    };
  }

  private getOtpExpiresIn(expiresAt: Date): number {
    const expiresAfterInSeconds = Math.floor(
      (expiresAt.getTime() - Date.now()) / 1000,
    );
    return expiresAfterInSeconds;
  }
}
