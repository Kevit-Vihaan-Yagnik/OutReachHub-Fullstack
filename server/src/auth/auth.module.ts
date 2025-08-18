import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "src/schema/admin.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { Token, TokenSchema } from "../schema/token.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGaurd } from "./auth.gaurd";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Admin.name, schema: AdminSchema },
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGaurd],
    exports : [AuthService, AuthGaurd]
})
export class AuthModule { }