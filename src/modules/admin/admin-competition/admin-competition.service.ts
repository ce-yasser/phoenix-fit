import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CompetitionsService } from '../../../shared/services/competitions/competitions.service';
import * as I from '../../../shared/interfaces';
import {
  Prisma,
  RegistrationStatus,
} from 'src/infrastructure/prisma/generated/client';
import { UsersService } from '../../../shared/services/users/users.service';
import { QrCodeService } from '../../../shared/services/competitions/generate-qr.service';
import { MailService } from '../../../infrastructure/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminCompetitionService {
  constructor(
    private readonly _competitionsService: CompetitionsService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
  ) {}

  async getAll(filters: I.FilterAugust2026Competition) {
    return await this._competitionsService.findAll(
      {
        ...filters,
        slug: 'august2026',
      },
      true,
    );
  }

  async getCompetitionById(id: string) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      0,
      true,
    );
    if (!competition) {
      throw new MethodNotAllowedException('Competition not found');
    }
    return { data: competition };
  }

  async updateStatus(id: string, status: RegistrationStatus, userId: number) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      0,
      true,
    );

    if (!competition) {
      throw new MethodNotAllowedException('Competition not found');
    }

    if (competition.status === status) {
      throw new MethodNotAllowedException(
        `Competition is already in status: ${status}`,
      );
    }

    // if status is not of RegistrationStatus
    if (!Object.values(RegistrationStatus).includes(status)) {
      throw new MethodNotAllowedException(
        `Invalid status: ${status}. Allowed statuses are: ${Object.values(
          RegistrationStatus,
        ).join(', ')}`,
      );
    }

    const user = await this.usersService.getUserById(userId);
    const updatedCompetition =
      await this._competitionsService.updateCompetitionById(id, {
        status: status,
        history: [
          {
            time: new Date().toISOString(),
            value: `Status updated to ${status}`,
            author: `#${userId} ${user?.name ?? ''}`,
          },
          ...competition.history,
        ] as Prisma.InputJsonValue[],
      });

    if (updatedCompetition.status === 'CONFIRMED') {
      const competitorId = updatedCompetition.userId;
      const competitor = await this.usersService.getUserById(competitorId);
      if (competitor?.email) {
        const competitionDto =
          updatedCompetition.data as unknown as I.August2026Competition;
        await this.mailService.sendFromAdminToUser(competitor.email, {
          type: 'registration-confirmed',
          data: {
            name: competitor.name,
            level: competitionDto.level,
            gender: competitionDto.gender,
            registrationId: competition.id,
            statusUrl: `${this.configService.get('BASE_URL')}/competition/${competition.id}`,
            qrCodeImage: await this.qrCodeService.generateQrCode(
              `${this.configService.get('BASE_URL')}/admin/competition/${competition.id}`,
              `${competition.id}.png`,
            ),
          },
        });
      }
    }

    return { data: updatedCompetition };
  }
}
