import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  otpExpiresIn = 1 * 60 * 1000; // 1 minute in milliseconds
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + this.otpExpiresIn);

    if (existingUser) {
      if (existingUser.otpExpiresAt && existingUser.otpExpiresAt > new Date()) {
        console.log('hello');
        return {
          message: 'duplicate',
          otp: existingUser.otp,
          expiresAfter: this.getOtpExpiresIn(existingUser.otpExpiresAt),
        };
      }
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

      return {
        message: 'generated',
        otp,
        expiresAfter: this.getOtpExpiresIn(expiresAt),
      };
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        otp,
        otpCreatedAt: new Date(),
        otpExpiresAt: expiresAt,
      },
    });

    return {
      message: 'User created',
      otp,
      user,
    };
  }

  private getOtpExpiresIn(expiresAt: Date): number {
    const expiresAfterInSeconds = Math.floor(
      (expiresAt.getTime() - Date.now()) / 1000,
    );
    return expiresAfterInSeconds;
  }
}
