import type { Role } from '../../infrastructure/prisma/generated/enums';

export interface UserListFilters {
  email?: string;
  role?: Role;
  name?: string;
  page?: number;
  limit?: number;
}
