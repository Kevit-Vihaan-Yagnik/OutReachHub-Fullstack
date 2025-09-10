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

class ContactInfoDto {
  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsNumber()
  @IsNotEmpty()
  phoneNo: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

class SingleContactDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateContactsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleContactDto)
  contacts: SingleContactDto[];
}
