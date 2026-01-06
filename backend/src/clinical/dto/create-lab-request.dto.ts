import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateLabRequestDto {
  @IsUUID()
  consultationId: string;

  @IsString()
  testName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
