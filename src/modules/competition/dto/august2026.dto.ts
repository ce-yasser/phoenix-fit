import { IsIn, IsNumberString, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class August2026Dto {
  @IsIn(['male', 'female'])
  gender!: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(2, 36)
  name!: string;

  @IsIn(['intermediate', 'advanced', 'elite', 'freestyle'])
  level!: string;

  @Transform(({ value }) => value?.trim())
  @IsNumberString()
  @Length(11, 11)
  phone!: string;
}
