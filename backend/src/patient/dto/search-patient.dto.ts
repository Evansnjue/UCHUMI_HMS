import { IsOptional, IsString } from 'class-validator';

export class SearchPatientDto {
  @IsOptional()
  @IsString()
  query?: string; // search by name or number

  @IsOptional()
  @IsString()
  department?: string; // department code
}
