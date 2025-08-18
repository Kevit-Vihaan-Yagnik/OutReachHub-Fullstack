import { IsOptional, IsString } from "class-validator";

export class UpdateWorkspaceDto {
    @IsString()
    name : string;

    @IsString()
    @IsOptional()
    description? : string;
}