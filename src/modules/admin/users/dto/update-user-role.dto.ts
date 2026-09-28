import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Role } from '../../../../infrastructure/prisma/generated/enums';

export class UpdateUserRoleDto {
  @Transform(({ value }) => value?.trim())
  @IsEnum(Role)
  role!: Role;
}
