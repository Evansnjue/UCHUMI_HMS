import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  patientId: string;

  @IsString()
  diagnosis: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
