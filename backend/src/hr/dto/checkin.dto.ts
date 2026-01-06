import { IsUUID, IsOptional, IsISO8601, IsString } from 'class-validator';

export class CheckInDto {
  @IsUUID() employeeId: string;
  @IsOptional() @IsISO8601() timestamp?: string;
}

export class CheckOutDto {
  @IsUUID() employeeId: string;
  @IsOptional() @IsISO8601() timestamp?: string;
}
