import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @Transform(({ value }) => value?.trim())
  @IsIn(['CANCELED'])
  status!: string;
}
