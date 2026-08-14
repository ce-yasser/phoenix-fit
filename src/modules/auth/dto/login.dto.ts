import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: 'Invalid email address.' })
  email!: string;
}
