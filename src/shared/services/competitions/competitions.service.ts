import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import type {
  Prisma,
  Competition as PrismaCompetition,
} from '../../../infrastructure/prisma/generated/client';
import * as I from '../../interfaces';
import { programs } from 'src/modules/general/programs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompetitionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  submitCompetition(
    userId: number,
    slug: string,
    data: I.CompetitionData,
  ): Promise<PrismaCompetition> {
    const programGenderEnum: Record<string, string> = {
      male: 'men',
      female: 'women',
    };
    const programGender = programGenderEnum[data.gender];
    // if gender is women, and level is intermediate, return 400 error
    if (
      programGender === 'women' &&
      ['intermediate', 'freestyle'].includes(data.level)
    ) {
      throw new MethodNotAllowedException(
        'Women cannot register for the intermediate level',
      );
    }
    return this.prisma.competition.create({
      data: {
        userId,
        competition: slug,
        history: [
          {
            time: new Date().toISOString(),
            value: 'Competition registered successfully.',
          },
        ],
        status: 'CREATED',
        data: data as Record<string, any>,
        fee: this.getCompetitionFee(programGender, data.level),
      },
    });
  }

  private getCompetitionFee(gender: string, level: string): number {
    if (!(gender in programs)) {
      return 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      programs[gender]?.find((p) => p?.title?.toLowerCase() === level)?.fee || 0
    );
  }

  async findAll(filters: I.FilterAugust2026Competition, includeUser = false) {
    const {
      id,
      slug,
      email,
      status,
      userId,
      level,
      name,
      phone,
      gender,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.CompetitionWhereInput = {
      ...(id && { id }),
      ...(email && {
        user: {
          email: { contains: email, mode: 'insensitive' },
        },
      }),
      ...(slug && { competition: slug }),
      ...(status && { status }),
      ...(userId && { userId }),

      // Dynamic JSON field filters — each becomes an entry in `AND`
      AND: [
        ...(level ? [{ data: { path: ['level'], equals: level } }] : []),
        ...(name
          ? [
              {
                data: {
                  path: ['name'],
                  string_contains: name,
                  mode: 'insensitive',
                },
              },
            ]
          : []),
        ...(phone
          ? [{ data: { path: ['phone'], string_contains: phone } }]
          : []),
        ...(gender ? [{ data: { path: ['gender'], equals: gender } }] : []),
      ] as Prisma.CompetitionWhereInput[],
    };

    const [registrations, total] = await Promise.all([
      this.prisma.competition.findMany({
        where,
        include: { user: includeUser },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.competition.count({ where }),
    ]);

    return {
      data: registrations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompetitionById(
    id: string,
    userId: number,
    isAdmin = false,
  ): Promise<PrismaCompetition | null> {
    const competition = await this.prisma.competition.findUnique({
      where: {
        id,
      },
    });

    if (!competition || (!isAdmin && competition?.userId !== userId)) {
      return null;
    }

    return competition;
  }

  updateCompetitionById(
    id: string,
    data: Prisma.CompetitionUpdateInput,
  ): Promise<PrismaCompetition> {
    return this.prisma.competition.update({
      where: {
        id,
      },
      data,
    });
  }

  // // This method is now redundant since updateCompetitionById covers updating by ID

  // findAll(): Promise<PrismaCompetition[]> {
  //   // return this.prisma.competition.findMany();
  // }
}
