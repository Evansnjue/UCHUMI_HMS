import { IsString, IsOptional, IsDateString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PatientNumberDto {
  @IsString()
  type: 'OPD' | 'IPD';

  @IsString()
  number: string;
}

class PatientDepartmentDto {
  @IsString()
  departmentCode: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PatientNumberDto)
  numbers?: PatientNumberDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PatientDepartmentDto)
  departments?: PatientDepartmentDto[];
}

