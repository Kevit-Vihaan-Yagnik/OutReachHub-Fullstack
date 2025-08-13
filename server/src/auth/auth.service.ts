import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "src/schema/admin.schema";
import { CreateAdminDto } from "./dto/createAdmin.dto";
import * as bcrypt from 'bcryptjs';
import { AdminLoginDto } from "./dto/loginAdmin.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schema/user.schema";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserdto } from "./dto/loginUser.dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Admin.name) private AdminModel: Model<Admin>,
        @InjectModel(User.name) private UserModel : Model<User>,
    ) { }

    async registerAdmin(createAdminDto: CreateAdminDto) {
        const hash = await bcrypt.hash(createAdminDto.password, 10);
        const newAdmin = new this.AdminModel({
            ...createAdminDto,
            password: hash
        })

        return newAdmin.save();
    }

    async resgisterUser(createUserDto : CreateUserDto){
        const hash = await bcrypt.hash(createUserDto.password , 10);
        const newUser = new this.UserModel({
            ...createUserDto,
            password : hash
        })

        return newUser.save();
    }

    async validateUser(email : string , password : string){
        const User = await this.UserModel.findOne({'contactInfo.email' : email});
        if(User && await bcrypt.compare(password , User.password)){
            return User;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async validateAdmin(email: string, password: string) {
        const Admin = await this.AdminModel.findOne({ 'contactInfo.email': email });
        if (Admin && await bcrypt.compare(password, Admin.password)) {
            return Admin
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async loginUser({email , password} : LoginUserdto){
        const user = await this.validateUser(email , password);

        return this.signIn(user , false)
    }

    async loginAdmin({ email, password }: AdminLoginDto) {
        const user = await this.validateAdmin(email, password);
        
        return this.signIn(user , true);
    }

    async signIn(user: any , isAdmin : boolean) {
        const payload = { sub: user._id, email: user.contactInfo.email , isAdmin : isAdmin};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    async verifyToken(token : string){
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}   