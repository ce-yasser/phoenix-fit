import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(
      new JwtAuthGuard({} as PrismaService, {} as Reflector),
    ).toBeDefined();
  });
});
