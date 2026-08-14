import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(2, 36)
  name!: string;
}
