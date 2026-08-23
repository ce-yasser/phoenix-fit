import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CompetitionsService } from '@services/competitions/competitions.service';
import * as I from '@interfaces';
import {
  Prisma,
  RegistrationStatus,
} from '/infrastructure/prisma/generated/client';

@Injectable()
export class AdminCompetitionService {
  constructor(private readonly _competitionsService: CompetitionsService) {}

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

    const updatedCompetition =
      await this._competitionsService.updateCompetitionById(id, {
        status: status,
        history: [
          {
            time: new Date().toISOString(),
            value: `Status updated to ${status}`,
            userId: userId,
          },
          ...competition.history,
        ] as Prisma.InputJsonValue[],
      });

    if (updatedCompetition.status === 'CONFIRMED') {
      const user = await this.usersService.getUserById(userId);
      if (user?.email) {
        const competitionDto =
          updatedCompetition.data as unknown as August2026Competition;
        await this.mailService.sendFromAdminToUser(user.email, {
          type: 'registration-received',
          data: {
            name: user.name ?? null,
            level: competitionDto.level,
            category: competitionDto.category,
            amount: String(competition.fee ?? 0),
            registrationId: competition.id,
            statusUrl: `${this.configService.get('BASE_URL')}/competition/${competition.id}`,
          },
        });
      }
    }

    return { data: updatedCompetition };
  }
}
