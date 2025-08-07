import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "src/schema/admin.schema";
import { CreateAdminDto } from "./dto/createAdmin.dto";
import * as bcrypt from 'bcryptjs';
import { AdminLoginDto } from "./dto/loginAdmin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Admin.name) private AdminModel: Model<Admin>
    ) { }

    async register(createAdminDto: CreateAdminDto) {
        const hash = await bcrypt.hash(createAdminDto.password, 10);
        const newAdmin = new this.AdminModel({
            ...createAdminDto,
            password: hash
        })

        return newAdmin.save();
    }

    async validateAdmin(email: string, password: string) {
        const Admin = await this.AdminModel.findOne({ 'contactInfo.email': email });
        if (Admin && await bcrypt.compare(password, Admin.password)) {
            return Admin
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async signIn(user: any) {
        const payload = { sub: user._id, email: user.contactInfo.email };
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

    async login({ email, password }: AdminLoginDto) {
        const user = await this.validateAdmin(email, password);
        
        return this.signIn(user);
    }
}   