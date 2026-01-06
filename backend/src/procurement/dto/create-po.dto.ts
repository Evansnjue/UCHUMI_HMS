import { IsUUID, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class POItemDto {
  @IsString() description: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unitPrice: number;
}

export class CreatePODto {
  @IsUUID() supplierId: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => POItemDto) items: POItemDto[];
  @IsOptional() @IsString() currency?: string;
}

export class ApprovePODto {
  @IsUUID() approverId: string;
  @IsOptional() @IsString() notes?: string;
}
