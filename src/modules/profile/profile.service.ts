import { Injectable } from '@nestjs/common';
import { UsersService } from '@services/users/users.service';
import type { User as PrismaUser } from '@infrastructure/prisma/generated/client';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(userId: number): Promise<Partial<PrismaUser> | null> {
    const user: Partial<PrismaUser> | null =
      await this.usersService.getUserById(userId);
    if (!user) return null;
    delete user.otp;
    delete user.otpCreatedAt;
    delete user.otpExpiresAt;
    delete user.emailVerified;
    return user;
  }

  async updateProfile(
    userId: number,
    data: Partial<PrismaUser>,
  ): Promise<Partial<PrismaUser> | null> {
    const user: Partial<PrismaUser> | null =
      await this.usersService.updateUserById(userId, data);
    if (!user) return null;
    delete user.otp;
    delete user.otpCreatedAt;
    delete user.otpExpiresAt;
    delete user.emailVerified;
    return user;
  }
}
