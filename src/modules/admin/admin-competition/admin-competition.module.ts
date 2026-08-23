import { Module } from '@nestjs/common';
import { AdminCompetitionController } from './admin-competition.controller';
import { AdminCompetitionService } from './admin-competition.service';
import { CompetitionsService } from '@services/competitions/competitions.service';
import { UsersService } from '@services/users/users.service';
import { QrCodeService } from '@services/competitions/generate-qr.service';
import { StorageService } from '@services/storage/storage.service';

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
