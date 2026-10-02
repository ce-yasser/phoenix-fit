import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { August2026Competition } from '../../shared/interfaces';
import { CompetitionsService } from '../../shared/services/competitions/competitions.service';
import { Prisma } from '../../infrastructure/prisma/generated/client';
import { StorageService } from '../../shared/services/storage/storage.service';
import { MailService } from '../../infrastructure/mail/mail.service';
import { UsersService } from '../../shared/services/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly _competitionsService: CompetitionsService,
    private readonly storageService: StorageService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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

  async getCompetitionById(id: string, userId: number, role = 'USER') {
    const isAdmin = ['ADMIN', 'SYSADMIN'].includes(role);
    const competition = await this._competitionsService.getCompetitionById(
      id,
      userId,
      isAdmin,
    );
    if (!competition) {
      throw new MethodNotAllowedException(
        'Registration not found or access denied',
      );
    }
    return { data: competition };
  }

  async uploadPayment(id: string, userId: number, file: Express.Multer.File) {
    const competition = await this._competitionsService.getCompetitionById(
      id,
      userId,
    );
    if (!file) {
      throw new MethodNotAllowedException('No file uploaded');
    }

    if (!competition) {
      throw new MethodNotAllowedException(
        'Registration not found or access denied',
      );
    }

    if (!['CREATED', 'REJECTED'].includes(competition.status)) {
      throw new MethodNotAllowedException(
        'Payment cannot be uploaded for this registration at the moment, please contact us for further assistance.',
      );
    }

    const extension = extname(file.originalname || 'file');
    const fileName = `${randomUUID()}${extension}`;
    const fileRelativePath = `payments/${fileName}`;

    if (!file.buffer || file.buffer.length === 0) {
      throw new MethodNotAllowedException('Uploaded file content is empty');
    }

    await this.storageService.write(fileRelativePath, file.buffer);

    const user = await this.usersService.getUserById(userId);

    const updatedCompetition =
      await this._competitionsService.updateCompetitionById(id, {
        payment: [fileRelativePath, ...competition.payment],
        status: 'PENDING',
        history: [
          {
            time: new Date().toISOString(),
            value: 'Payment uploaded successfully',
            author: `#${userId} ${user?.name ?? ''}`,
          },
          ...competition.history,
        ] as Prisma.InputJsonValue[],
      });

    if (user?.email) {
      const competitionDto =
        updatedCompetition.data as unknown as August2026Competition;
      await this.mailService.sendFromAdminToUser(user.email, {
        type: 'registration-received',
        data: {
          name: user.name ?? null,
          level: competitionDto.level,
          gender: competitionDto.gender,
          amount: String(competition.fee ?? 0),
          registrationId: competition.id,
          statusUrl: `${this.configService.get('BASE_URL')}/competition/${competition.id}`,
        },
      });
    }

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

    return { data: updatedCompetition };
  }
}
