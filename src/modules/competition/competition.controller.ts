import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  UploadedFile,
} from '@nestjs/common';
import { CurrentUser } from '@decorators/current-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth/jwt-auth.guard';
import type { JwtPayload } from '@interfaces';
import { CompetitionService } from './competition.service';
import { August2026Dto } from './dto/august2026.dto';
import { FilterAugust2026Dto } from './dto/filterAugust2026.dto';
import { UploadInterceptor } from '@interceptors/upload.interceptor';

@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post('august2026')
  @UseGuards(JwtAuthGuard)
  submitCompetition(
    @CurrentUser() user: JwtPayload,
    @Body()
    competitionDto: August2026Dto,
  ) {
    return this.competitionService.submitAugust2026(user.sub, competitionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllCompetitions(
    @CurrentUser() user: JwtPayload,
    @Query() filters: FilterAugust2026Dto,
  ) {
    return this.competitionService.getAll(user.sub, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.competitionService.getCompetitionById(id, user.sub, user.role);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
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
    return this.competitionService.uploadPayment(id, user.sub, user.role, file);
  }
}
