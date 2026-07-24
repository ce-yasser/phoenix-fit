import { Injectable } from '@nestjs/common';

@Injectable()
export class CompetitionService {
  async registerCompetition(competitionDto: any) {
    // Here you would typically handle the competition registration logic,
    // such as saving the data to a database or performing other business logic.
    console.log('Competition registration data:', competitionDto);
    return await Promise.resolve({ message: 'Competition registered successfully', data: competitionDto });
  }
}
