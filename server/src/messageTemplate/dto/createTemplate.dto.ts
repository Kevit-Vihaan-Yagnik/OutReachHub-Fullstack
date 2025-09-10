import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTemplateDto{
    @IsString()
    @IsNotEmpty()
    title : string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type? : string;

    @IsString()
    template : string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    campaignImage? : string;
}