import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PermissionDto {
  @IsBoolean()
  @IsOptional()
  allowAdd: boolean = false;

  @IsBoolean()
  @IsOptional()
  write: boolean = false;
}

class WorkspacePermissionDto {
  @IsMongoId()
  @IsNotEmpty()
  workspaceId: string;

  @ValidateNested()
  @Type(() => PermissionDto)
  permission: PermissionDto;
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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatarUrl? : string

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspacePermissionDto)
  @IsOptional()
  workspaces?: WorkspacePermissionDto[];
}
