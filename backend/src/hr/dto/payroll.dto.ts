import { IsDateString, IsUUID, IsOptional } from 'class-validator';

export class GeneratePayrollDto {
  @IsDateString() periodStart: string;
  @IsDateString() periodEnd: string;
  @IsUUID() @IsOptional() employeeId?: string;
}
