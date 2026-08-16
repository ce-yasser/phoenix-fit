import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpDto } from './dto/verify.dto';
import { UsersService } from '@services/users/users.service';
import type { User as PrismaUser } from '@infrastructure/prisma/generated/client.js';
import { MailService } from '@infrastructure/mail/mail.service';

@Injectable()
export class AuthService {
  otpExpiresIn = 10 * 60 * 1000; // 10 minutes in milliseconds
  duplicateOtpWindowIn = 1 * 60 * 1000; // 1 minute in milliseconds
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const existingUser: PrismaUser | null =
      await this.usersService.getUserByEmail(dto.email);

    const disableOtpGeneration =
      existingUser?.otpCreatedAt &&
      existingUser.otpCreatedAt.getTime() + this.duplicateOtpWindowIn >
        Date.now();

    if (disableOtpGeneration) {
      return {
        data: {
          message: 'duplicate',
          otp: existingUser.otp,
          expiresAfter: this.getDuplicateOtpWindow(
            existingUser.otpCreatedAt || new Date(),
          ),
          isNewUser: !existingUser.emailVerified,
        },
      };
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date(Date.now() + this.otpExpiresIn);
    const otpCreatedAt = new Date();

    let message: string = 'generated';

    if (existingUser) {
      await this.usersService.updateUserByEmail(dto.email, {
        otp,
        otpCreatedAt,
        otpExpiresAt: expiresAt,
      });
    } else {
      message = 'User created';
      await this.usersService.createUser(dto.email, {
        otp,
        otpCreatedAt,
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
        expiresAfter: this.getDuplicateOtpWindow(otpCreatedAt),
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
      throw new BadRequestException('Invalid OTP code. Please try again!');
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
      data: { accessToken, isRegistered: !!user.name },
    };
  }

  async register(userId: number, name: string) {
    const user = await this.usersService.getUserById(userId);
    if (user?.name) {
      throw new BadRequestException('User already registered');
    }
    await this.usersService.updateUserById(userId, { name });
    return { data: { success: true } };
  }

  private getDuplicateOtpWindow(createdAt: Date): number {
    const expiresAfterInSeconds = Math.floor(
      (createdAt.getTime() + this.duplicateOtpWindowIn - Date.now()) / 1000,
    );
    return expiresAfterInSeconds;
  }
}
