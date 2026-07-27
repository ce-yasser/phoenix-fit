import { Controller, Get, Query, Param } from '@nestjs/common';
import { AdminCompetitionService } from './admin-competition.service';
import { FilterAugust2026Dto } from '@dtos/filterAugust2026.dto';
import { BaseAdminController } from '../base-admin.controller';

@Controller('competition')
export class AdminCompetitionController extends BaseAdminController {
  constructor(private readonly competitionService: AdminCompetitionService) {
    super();
  }

  @Get()
  getAllCompetitions(@Query() filters: FilterAugust2026Dto) {
    return this.competitionService.getAll(filters);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.competitionService.getCompetitionById(id);
  }
}
