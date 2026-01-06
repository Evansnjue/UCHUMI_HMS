import { IsString, IsOptional, IsDateString, IsEmail, ValidateNested, ArrayMinSize } from 'class-validator';
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

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

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
