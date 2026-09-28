import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '../../../../infrastructure/prisma/generated/enums';

export class FilterUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @Transform(({ value }: { value?: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @Transform(({ value }: { value?: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Transform(({ value }: { value?: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
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
