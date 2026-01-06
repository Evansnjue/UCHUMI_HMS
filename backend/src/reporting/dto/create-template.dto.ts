import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateTemplateDto {
  @IsString() name: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() description?: string;
  @IsObject() kpiDefinitions: any;
  @IsOptional() @IsObject() defaultParams?: any;
}
