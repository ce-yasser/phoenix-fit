import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CompetitionsService } from '@services/competitions/competitions.service';
import * as I from '@interfaces';

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
}
