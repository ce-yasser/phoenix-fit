import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class August2026Dto {
  @IsIn(['male', 'female'])
  gender!: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(2, 36)
  name!: string;

  @Transform(({ value }) => value?.trim())
  @IsIn(['strength', 'endurance', 'flexibility'])
  category!: string;

  @IsIn(['beginner', 'intermediate', 'advanced'])
  level!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'Age must be a number.' })
  @Min(18)
  age!: number;

  @Transform(({ value }) => value?.trim())
  @IsNumberString()
  @Length(11, 11)
  phone!: string;
}
