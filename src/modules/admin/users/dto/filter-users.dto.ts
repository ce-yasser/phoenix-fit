import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../../../../infrastructure/prisma/generated/enums';

export class FilterUsersDto {
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
