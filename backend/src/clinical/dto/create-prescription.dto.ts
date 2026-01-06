import { IsUUID, ValidateNested, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsUUID()
  drugId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  instructions?: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  consultationId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}
