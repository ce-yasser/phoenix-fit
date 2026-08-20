import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@decorators/current-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth/jwt-auth.guard';
import type { JwtPayload } from '@interfaces';
import { CompetitionService } from './competition.service';
import { August2026Dto } from './dto/august2026.dto';
import { FilterAugust2026Dto } from '@dtos/filterAugust2026.dto';
import { UploadInterceptor } from '@interceptors/upload.interceptor';
import { UpdateStatusDto } from './dto/updateStatus.dto';

@Controller('competition')
@UseGuards(JwtAuthGuard)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post('august2026')
  submitCompetition(
    @CurrentUser() user: JwtPayload,
    @Body()
    competitionDto: August2026Dto,
  ) {
    return this.competitionService.submitAugust2026(user.sub, competitionDto);
  }

  @Get()
  getAllCompetitions(
    @CurrentUser() user: JwtPayload,
    @Query() filters: FilterAugust2026Dto,
  ) {
    return this.competitionService.getAll(user.sub, filters);
  }

  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.competitionService.getCompetitionById(id, user.sub);
  }

  @Post(':id')
  @UploadInterceptor({
    fieldName: 'payment',
    destination: '/payments',
    maxSize: 1 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  })
  uploadPayment(
    @CurrentUser() user: JwtPayload,
    @Param('id')
    id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.competitionService.uploadPayment(id, user.sub, file);
  }

  @Put(':id')
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() statusDto: UpdateStatusDto,
  ) {
    return this.competitionService.updateStatus(id, user.sub, statusDto.status);
  }
}
