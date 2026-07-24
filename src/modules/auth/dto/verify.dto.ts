import { Transform } from 'class-transformer';
import { IsEmail, IsNumberString, Length } from 'class-validator';

export class VerifyOtpDto {
  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: 'Invalid email address.' })
  email!: string;

  @Transform(({ value }) => value?.trim())
  @IsNumberString({}, { message: 'OTP must contain only numeric digits.' })
  @Length(4, 4)
  otp!: string;
}
