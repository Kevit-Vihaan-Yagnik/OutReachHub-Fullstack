import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Admin } from "src/schema/admin.schema";
import { CreateAdminDto } from "./dto/createAdmin.dto";
import * as bcrypt from 'bcryptjs';
import { AdminLoginDto } from "./dto/loginAdmin.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schema/user.schema";
import { Token } from "../schema/token.schema";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserdto } from "./dto/loginUser.dto";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Admin.name) private AdminModel: Model<Admin>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Token.name) private TokenModel: Model<Token>,
    ) { }

    async registerAdmin(createAdminDto: CreateAdminDto) {
        const hash = await bcrypt.hash(createAdminDto.password, 10);
        const newAdmin = new this.AdminModel({
            ...createAdminDto,
            password: hash
        })

        return newAdmin.save();
    }

    async getUserInfo(userId: string) {
        const user = await this.UserModel.findById(userId).populate({
            path: 'workspaces.workspaceId', // path to populate
            select: 'name', // only bring back the name field
        }).select('-password');;
        return user;
    }

    async resgisterUser(createUserDto: CreateUserDto) {
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.UserModel({
            ...createUserDto,
            password: hash
        })

        return newUser.save();
    }

    async validateUser(email: string, password: string) {
        const User = await this.UserModel.findOne({ 'contactInfo.email': email });
        if (User && await bcrypt.compare(password, User.password)) {
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

    async loginUser({ email, password }: LoginUserdto) {
        const user = await this.validateUser(email, password);

        return this.signIn(user, false)
    }

    async loginAdmin({ email, password }: AdminLoginDto) {
        const user = await this.validateAdmin(email, password);

        return this.signIn(user, true);
    }

    async signIn(user: any, isAdmin: boolean) {
        const payload = { sub: user._id, email: user.contactInfo.email, isAdmin };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        // Generate random refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await this.TokenModel.deleteMany({ user: user._id });
        await new this.TokenModel({ user: user._id, refreshToken }).save();
        return {
            id: payload.sub,
            email: payload.email,
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async verifyToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async refreshAccessToken(refreshToken: string) {
        const tokenDoc = await this.TokenModel.findOne({ refreshToken: refreshToken });

        if (!tokenDoc) {
            // Token reuse detected: delete all tokens for user (if possible)
            throw new UnauthorizedException('Refresh token reuse detected. Session invalidated.');
        }
        // Find user    
        const user = await this.UserModel.findById(tokenDoc.user);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        // Issue new access token and new random refresh token
        const newAccessToken = this.jwtService.sign({ sub: user._id, email: user.contactInfo.email, isAdmin: false }, { expiresIn: '1h' });
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        await this.TokenModel.deleteOne({ refreshToken });
        await new this.TokenModel({ user: user._id, refreshToken: newRefreshToken }).save();
        return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }

    async logout(userId: string) {
        const deletedtoken = await this.TokenModel.deleteMany({ user: new Types.ObjectId(userId) });
        return { message: 'Logged out successfully', token: deletedtoken };
    }

}