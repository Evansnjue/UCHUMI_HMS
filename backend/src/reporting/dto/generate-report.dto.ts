import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GenerateReportDto {
  @IsUUID() templateId: string;
  @IsDateString() periodStart: string;
  @IsDateString() periodEnd: string;
  @IsOptional() @IsString() type?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}
