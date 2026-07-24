import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompetitionDto } from './dto/competition.dto';
import { CurrentUser } from '@decorators/current-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth/jwt-auth.guard';
import type { JwtPayload } from '@interfaces';

@Controller('competition')
export class CompetitionController {
  @Post()
  @UseGuards(JwtAuthGuard)
  submitCompetition(
    @CurrentUser() user: JwtPayload,
    @Body()
    competitionDto: CompetitionDto,
  ) {
    // Handle the competition submission logic here
    return {
      message: 'Competition submitted successfully',
      data: competitionDto,
    };
  }
}
