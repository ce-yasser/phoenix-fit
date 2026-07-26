import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { CompetitionsService } from '@services/competitions/competitions.service';
import { StorageService } from '@services/storage/storage.service';

@Module({
  controllers: [CompetitionController],
  providers: [CompetitionService, CompetitionsService, StorageService],
})
export class CompetitionModule {}
