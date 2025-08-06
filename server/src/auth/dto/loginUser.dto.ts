import { Prop } from "@nestjs/mongoose";
import { IsEmail } from "class-validator";

export class UserLoginDto{
    @Prop({required : true})
    @IsEmail()
    email : string;

    @Prop({required : true})
    password : string;
}