import { Injectable } from '@nestjs/common';
import type { August2026Competition } from '@interfaces';
import { CompetitionsService } from '@services/competitions/competitions.service';

@Injectable()
export class CompetitionService {
  constructor(private readonly _competitionsService: CompetitionsService) {}

  async submitAugust2026(
    userId: string,
    competitionDto: August2026Competition,
  ) {
    const competition = await this._competitionsService.submitCompetition(
      userId,
      'august2026',
      competitionDto,
    );

    return {
      message: 'Competition registered successfully',
      data: competitionDto,
    };
  }

  async getAll(userId: string, filters: any) {
    return await this._competitionsService.findAll(
      {...filters, slug: 'august2026', userId},
    );
  }
}
