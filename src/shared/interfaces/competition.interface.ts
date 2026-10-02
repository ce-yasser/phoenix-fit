import type { RegistrationStatus } from '../../infrastructure/prisma/generated/client';

export interface August2026Competition {
  gender: string;
  name: string;
  level: string;
  phone: string;
}

export interface FilterAugust2026Competition {
  id?: string;
  slug?: string;
  status?: RegistrationStatus;
  email?: string;
  level?: string;
  name?: string;
  phone?: string;
  gender?: string;
  page?: number;
  limit?: number;
  userId?: number;
}

export type CompetitionData = August2026Competition;
