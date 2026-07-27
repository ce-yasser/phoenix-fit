import { Test, TestingModule } from '@nestjs/testing';
import { AdminCompetitionService } from './admin-competition.service';

describe('AdminCompetitionService', () => {
  let service: AdminCompetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCompetitionService],
    }).compile();

    service = module.get<AdminCompetitionService>(AdminCompetitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
