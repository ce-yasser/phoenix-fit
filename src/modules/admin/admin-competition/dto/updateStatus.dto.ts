import { Transform } from 'class-transformer';
import { RegistrationStatus } from '../../../../infrastructure/prisma/generated/enums';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateStatusDto {
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value as string | undefined | null;
  })
  @IsEnum(RegistrationStatus)
  status!: RegistrationStatus;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value as string | undefined | null;
  })
  @IsString()
  @Length(5, 500)
  reason?: string;
}
