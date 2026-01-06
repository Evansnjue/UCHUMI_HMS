import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateClaimDto {
  @IsOptional() @IsUUID() patientId?: string;
  @IsString() claimNumber: string;
  @IsString() insurer: string;
  @IsNumber() amount: number;
  @IsOptional() @IsString() notes?: string;
}

export class ProcessClaimDto {
  @IsString() action: 'APPROVE' | 'REJECT' | 'PAY';
  @IsOptional() @IsString() notes?: string;
}
