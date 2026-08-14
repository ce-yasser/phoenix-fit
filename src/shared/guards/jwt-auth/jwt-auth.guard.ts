import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import { JwtPayload } from '@interfaces';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    // if request.url ends with /auth/register
    const payload = request.user;

    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    const noName = this.reflector.getAllAndOverride<boolean>('no_name', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noName) {
      return true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { name: true },
    });

    if (!user?.name) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
