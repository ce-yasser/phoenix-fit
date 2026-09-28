import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import type {
  Prisma,
  User as PrismaUser,
} from '../../../infrastructure/prisma/generated/client';
import type { UserListFilters } from '../../interfaces/users.interface';

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

  getUserById(id: number): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
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

  async findAll(filters: UserListFilters = {}) {
    const { email, role, name, page = 1, limit = 10 } = filters;
    console.log('filters', filters);

    const where: Prisma.UserWhereInput = {
      ...(email && {
        email: { contains: email, mode: 'insensitive' },
      }),
      ...(role && { role }),
      ...(name && {
        name: { contains: name, mode: 'insensitive' },
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
