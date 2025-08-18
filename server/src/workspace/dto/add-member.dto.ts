
import {
  IsBoolean,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MemberPermissionsDto {
  @IsOptional()
  @IsBoolean()
  editor: boolean;

  @IsOptional()
  @IsBoolean()
  viewer: boolean;

  @IsOptional()
  @IsBoolean()
  allowAdd: boolean;
}


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

export class MemberToAddDto {
  // For existing users
  @IsOptional()
  @IsMongoId()
  userId?: string;

  // For new users
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MemberPermissionsDto)
  permissions: MemberPermissionsDto;
}

export class AddMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberToAddDto)
  members: MemberToAddDto[];
}