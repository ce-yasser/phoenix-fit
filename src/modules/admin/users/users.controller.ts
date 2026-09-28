import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { Role } from '../../../infrastructure/prisma/generated/enums';
import { BaseAdminController } from '../base-admin.controller';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { UsersService } from './users.service';
import type { JwtPayload } from '../../../shared/interfaces';
import { FilterUsersDto } from './dto/filter-users.dto';

@Controller('users')
export class UsersController extends BaseAdminController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Get()
  getAllUsers(
    @Query()
    filters: FilterUsersDto,
  ) {
    return this.usersService.getAllUsers(filters);
  }

  @Put(':id')
  updateRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('role') role: Role,
  ) {
    return this.usersService.updateUserRole(id, role, user.sub);
  }
}
