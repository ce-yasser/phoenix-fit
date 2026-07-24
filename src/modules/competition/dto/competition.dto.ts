import { IsIn, IsNumber, IsNumberString, IsString, Length, Min, ValidationArguments } from 'class-validator';
import { Transform } from 'class-transformer';

export class CompetitionDto {
  @IsIn(['male', 'female'], {
    message: 'gender must be either male or female.',
  })
  gender!: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(2, 36, {
    message: (args: ValidationArguments) =>
      `Name must be between ${args.constraints[0]} and ${args.constraints[1]} characters long.`,
  })
  name!: string;

  @IsIn(['strength', 'endurance', 'flexibility'], {
    message: 'Category must be strength, endurance, or flexibility.',
  })
  category!: string;

  @IsIn(['beginner', 'intermediate', 'advanced'])
  level!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'Age must be a number.' })
  @Min(18)
  age!: number;

  @Transform(({ value }) => value?.trim())
  @IsNumberString(
    {},
    { message: 'Phone number must contain only numeric digits.' },
  )
  @Length(11, 11, {
    message: `Phone number must be exactly 11 digits long.`,
  })
  phone!: string;
}
