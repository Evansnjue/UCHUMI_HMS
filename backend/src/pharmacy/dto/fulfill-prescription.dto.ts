import { IsArray, IsUUID, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class FulfillItemDto {
  @IsUUID()
  prescriptionItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class FulfillPrescriptionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillItemDto)
  items: FulfillItemDto[];
}
