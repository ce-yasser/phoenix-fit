import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
import type { Competition as PrismaCompetition } from '@infrastructure/prisma/generated/client';
@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}

  // submitCompetition(data: Partial<PrismaCompetition>): Promise<PrismaCompetition> {
  //   return this.prisma.competition.create({
  //     data,
  //   });
  // }

  // getCompetitionById(id: string): Promise<PrismaCompetition | null> {
  //   // return this.prisma.competition.findUnique({
  //   //   where: {
  //   //     id,
  //   //   },
  //   // });
  // }

  // updateCompetitionById(
  //   id: string,
  //   data: Partial<PrismaCompetition>,
  // ): Promise<PrismaCompetition> {
  //   // return this.prisma.competition.update({
  //   //   where: {
  //   //     id,
  //   //   },
  //   //   data,
  //   // });
  // }

  // // This method is now redundant since updateCompetitionById covers updating by ID

  // findAll(): Promise<PrismaCompetition[]> {
  //   // return this.prisma.competition.findMany();
  // }
}
