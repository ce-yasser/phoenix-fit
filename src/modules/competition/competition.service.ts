import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import type { August2026Competition } from '@interfaces';
import { CompetitionsService } from '@services/competitions/competitions.service';
import { Prisma } from '@infrastructure/prisma/generated/client';
import { StorageService } from '@services/storage/storage.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly _competitionsService: CompetitionsService,
    private readonly storageService: StorageService,
  ) {}

  async submitAugust2026(
    userId: number,
    competitionDto: August2026Competition,
  ) {
    const competition = await this._competitionsService.submitCompetition(
      userId,
      'august2026',
      competitionDto,
    );

    return {
      message: 'Competition registered successfully',
      data: { id: competition.id, status: competition.status },
    };
  }

  async getAll(userId: number, filters: any) {
    return await this._competitionsService.findAll({
      ...filters,
      slug: 'august2026',
      userId,
    });
  }

  async getCompetitionById(id: string, userId: number, role: string) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      userId,
    );
    if (!competition) {
      throw new MethodNotAllowedException(
        'Registration not found or access denied',
      );
    }
    return { data: competition };
  }

  async uploadPayment(
    id: string,
    userId: number,
    role: string,
    file: Express.Multer.File,
  ) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      userId,
    );
    const fileRelativePath = 'payments/' + file.filename;
    if (!competition) {
      this.storageService.delete(fileRelativePath);
      throw new MethodNotAllowedException(
        'Registration not found or access denied',
      );
    }

    if (!['CREATED', 'REJECTED'].includes(competition.status)) {
      this.storageService.delete(fileRelativePath);
      throw new MethodNotAllowedException(
        'Payment cannot be uploaded for this registration at the moment, please contact us for further assistance.',
      );
    }

    const updatedCompetition =
      await this._competitionsService.updateCompetitionById(id, {
        payment: [fileRelativePath, ...competition.payment],
        status: 'PENDING',
        history: [
          {
            time: new Date().toISOString(),
            value: 'Payment uploaded successfully',
            userId: userId,
          },
          ...competition.history,
        ] as Prisma.InputJsonValue[],
      });

    return { data: updatedCompetition };
  }

  async updateStatus(id: string, userId: number, status: string) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      userId,
    );
    if (!competition) {
      throw new MethodNotAllowedException(
        'Registration not found or access denied',
      );
    }

    if (competition.status === status || status !== 'CANCELED') {
      throw new MethodNotAllowedException(
        'Invalid status update, please contact us for further assistance.',
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

    return { data: updatedCompetition };
  }
}
