import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import type { User as PrismaUser } from '@infrastructure/prisma/generated/client';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getUserByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  updateUserByEmail(
    email: string,
    data: Partial<PrismaUser>,
  ): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: {
        email,
      },
      data,
    });
  }

  updateUserById(id: number, data: Partial<PrismaUser>): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  createUser(email: string, data?: Partial<PrismaUser>): Promise<PrismaUser> {
    return this.prisma.user.create({
      data: {
        email,
        ...data,
      },
    });
  }

  findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }
}
