import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCampaignDto {
  @IsMongoId()
  @IsNotEmpty()
  templateId: string;

  @IsMongoId()
  @IsOptional()
  creator?: string;

  @IsMongoId()
  @IsOptional()
  lastModifiedBy?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(["Draft", "Running", "Completed"])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
