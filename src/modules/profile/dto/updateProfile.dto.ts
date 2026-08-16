import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(2, 36)
  name!: string;
}
