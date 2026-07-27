import { Module } from '@nestjs/common';
import { AdminCompetitionModule } from './admin-competition/admin-competition.module';
import { RouterModule } from '@nestjs/core';

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
        ],
      },
    ]),
  ],
})
export class AdminModule {}
