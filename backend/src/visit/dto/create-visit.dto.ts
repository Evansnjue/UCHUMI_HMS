import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsUUID()
  patientId: string;

  @IsString()
  departmentCode: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  visitNumber?: string; // optional externally-supplied number
}
