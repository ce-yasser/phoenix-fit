import { Module } from '@nestjs/common';
import { AdminCompetitionController } from './admin-competition.controller';
import { AdminCompetitionService } from './admin-competition.service';
import { CompetitionsService } from '@services/competitions/competitions.service';

@Module({
  controllers: [AdminCompetitionController],
  providers: [AdminCompetitionService, CompetitionsService],
})
export class AdminCompetitionModule {}
