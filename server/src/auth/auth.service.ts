import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
import { CreateUserDto } from "./dto/createUser.dto";
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from "./dto/loginUser.dto";

@Injectable()
export class AuthService{
    constructor(@InjectModel(User.name) private userModel : Model<User>){}

    async register(createUserDto : CreateUserDto){
        const hash  = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.userModel({
            ...createUserDto,
            password : hash
        })

        return newUser.save();
    }

    async login({email , password} : UserLoginDto){
        const user = await this.userModel.findOne({'contactInfo.email' : email});
        if(!user) throw new HttpException("User not found please login" , 404);

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) throw new UnauthorizedException("Invalid credentials");

        return {message : 'Login successful' , user};
    }
}   