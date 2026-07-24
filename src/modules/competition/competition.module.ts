import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { CompetitionsService } from '@services/competitions/competitions.service';

@Module({
  controllers: [CompetitionController],
  providers: [CompetitionService, CompetitionsService],
})
export class CompetitionModule {}
