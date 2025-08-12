import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserdto{

    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsString()
    @IsNotEmpty()
    password : string;
}