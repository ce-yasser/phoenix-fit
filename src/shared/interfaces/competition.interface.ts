import type { RegistrationStatus } from '@infrastructure/prisma/generated/client';

export interface August2026Competition {
  gender: string;
  name: string;
  category: string;
  level: string;
  age: number;
  phone: string;
}

export interface FilterAugust2026Competition {
  slug?: string;
  status?: RegistrationStatus;
  email?: string;
  age?: number;
  level?: string;
  category?: string;
  name?: string;
  phone?: string;
  gender?: string;
  page?: number;
  limit?: number;
  userId?: number;
}

export type CompetitionData = August2026Competition;
