import { Test, TestingModule } from '@nestjs/testing';
import { AdminCompetitionController } from './admin-competition.controller';

describe('AdminCompetitionController', () => {
  let controller: AdminCompetitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCompetitionController],
    }).compile();

    controller = module.get<AdminCompetitionController>(AdminCompetitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
