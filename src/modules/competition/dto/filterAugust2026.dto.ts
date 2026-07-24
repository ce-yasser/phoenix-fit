// dto/filter-registrations.dto.ts
import { IsOptional, IsString, IsEnum, IsInt, IsIn, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RegistrationStatus } from '@infrastructure/prisma/generated/client';

export class FilterAugust2026Dto {
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @Type(() => Number)
  @IsInt()
  age?: number;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  level?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsIn(['strength', 'endurance', 'flexibility'])
  category?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(2, 36)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @Length(1, 11)
  @IsString()
  phone?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsIn(['male', 'female'])
  gender?: string;

  // pagination, since "all registrations" can get big
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
