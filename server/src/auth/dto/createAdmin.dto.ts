import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ContactInfoDto {
  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsNumber()
  @IsNotEmpty()
  phoneNo: number;

  @IsEmail()
  email: string;
}
export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}