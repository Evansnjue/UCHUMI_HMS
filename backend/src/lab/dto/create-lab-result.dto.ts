import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateLabResultDto {
  @IsUUID()
  labRequestId: string;

  @IsUUID()
  testId: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  units?: string;
}
