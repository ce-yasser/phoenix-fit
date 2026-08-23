import { Module } from '@nestjs/common';
import { AdminCompetitionController } from './admin-competition.controller';
import { AdminCompetitionService } from './admin-competition.service';
import { CompetitionsService } from '../../../shared/services/competitions/competitions.service';
import { UsersService } from '../../../shared/services/users/users.service';
import { QrCodeService } from '../../../shared/services/competitions/generate-qr.service';
import { StorageService } from '../../../shared/services/storage/storage.service';

@Module({
  controllers: [AdminCompetitionController],
  providers: [
    AdminCompetitionService,
    CompetitionsService,
    UsersService,
    QrCodeService,
    StorageService,
  ],
})
export class AdminCompetitionModule {}
