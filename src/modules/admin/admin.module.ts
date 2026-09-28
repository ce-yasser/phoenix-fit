import { Module } from '@nestjs/common';
import { AdminCompetitionModule } from './admin-competition/admin-competition.module';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AdminCompetitionModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: '/',
            module: AdminCompetitionModule,
          },
          {
            path: '/',
            module: UsersModule,
          },
        ],
      },
    ]),
    UsersModule,
  ],
})
export class AdminModule {}
