import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { CompetitionsService } from '../../shared/services/competitions/competitions.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { UsersService } from '../../shared/services/users/users.service';

@Module({
  controllers: [CompetitionController],
  providers: [
    CompetitionService,
    CompetitionsService,
    StorageService,
    UsersService,
  ],
})
export class CompetitionModule {}
