import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersService as SharedUsersService } from '../../../shared/services/users/users.service';

@Module({
  providers: [UsersService, SharedUsersService],
  controllers: [UsersController],
})
export class UsersModule {}
