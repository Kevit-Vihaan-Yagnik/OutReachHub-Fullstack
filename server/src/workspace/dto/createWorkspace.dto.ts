import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkspaceDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  users?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  campaigns?: string[];
}
