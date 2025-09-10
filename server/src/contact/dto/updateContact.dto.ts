import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactInfoUpdateDto {
  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  phoneNo?: number;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoUpdateDto)
  contactInfo?: ContactInfoUpdateDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  company?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jobTitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}