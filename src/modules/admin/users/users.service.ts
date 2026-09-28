import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Role } from '../../../infrastructure/prisma/generated/enums';
import { UsersService as SharedUsersService } from '../../../shared/services/users/users.service';
import type { UserListFilters } from '../../../shared/interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersService: SharedUsersService) {}

  async getAllUsers(
    filters: UserListFilters = {},
  ): Promise<ReturnType<SharedUsersService['findAll']>> {
    return this.usersService.findAll(filters);
  }

  async updateUserRole(id: string, role: Role, curretUserId: number) {
    const currentUser = await this.usersService.getUserById(curretUserId);
    if (!currentUser) {
      throw new MethodNotAllowedException('Current user not found');
    }
    if (currentUser.role !== Role.SYSADMIN) {
      throw new MethodNotAllowedException(
        'Only SYSADMIN can update user roles',
      );
    }

    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new MethodNotAllowedException('Invalid user id');
    }

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new MethodNotAllowedException('User not found');
    }

    if (!Object.values(Role).includes(role)) {
      throw new MethodNotAllowedException(
        `Invalid role: ${role}. Allowed roles are: ${Object.values(Role).join(', ')}`,
      );
    }

    if (user.role === role) {
      throw new MethodNotAllowedException(`User is already in role: ${role}`);
    }

    const updatedUser = await this.usersService.updateUserById(userId, {
      role,
    });

    return { data: updatedUser };
  }
}
