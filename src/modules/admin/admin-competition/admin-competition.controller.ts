import { Controller, Get, Query, Param, Put, Body } from '@nestjs/common';
import { AdminCompetitionService } from './admin-competition.service';
import { FilterAugust2026Dto } from '@dtos/filterAugust2026.dto';
import { BaseAdminController } from '../base-admin.controller';
import { CurrentUser } from '@decorators/current-user.decorator';
import type { JwtPayload } from '@interfaces';
import { UpdateStatusDto } from './dto/updateStatus.dto';

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

  @Put(':id')
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.competitionService.updateStatus(id, body.status, user.sub);
  }
}
