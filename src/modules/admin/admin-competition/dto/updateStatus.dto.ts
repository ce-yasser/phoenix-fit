import { Transform } from 'class-transformer';
import { RegistrationStatus } from '@infrastructure/prisma/generated/enums';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @Transform(({ value }) => value?.trim())
  @IsEnum(RegistrationStatus)
  status!: RegistrationStatus;
}
