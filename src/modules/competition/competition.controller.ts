import { Controller, Post, Body } from '@nestjs/common';
import { CompetitionDto } from './dto/competition.dto';

@Controller('competition')
export class CompetitionController {
  @Post()
  submitCompetition(@Body() competitionDto: CompetitionDto) {
    console.log('Received competition submission:', competitionDto);
    // Handle the competition submission logic here
    return { message: 'Competition submitted successfully', data: competitionDto };
  }
}
