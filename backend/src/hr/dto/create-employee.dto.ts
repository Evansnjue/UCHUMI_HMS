import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() role: string;
  @IsOptional() @IsString() department?: string;
  @IsDateString() hireDate: string;
  @IsNumber() @Min(0) salary: number;
}
