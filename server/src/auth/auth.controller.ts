import { Body, Controller, Post } from "@nestjs/common";
import { CreateAdminDto } from "./dto/createAdmin.dto";
import { AdminLoginDto } from "./dto/loginAdmin.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}

    @Post('register')
    async register(@Body() createAdminDto : CreateAdminDto){
        return this.authService.register(createAdminDto);
    }

    @Post('login')
    async login(@Body() AdminLoginDto : AdminLoginDto){
        return this.authService.login(AdminLoginDto);
    }
}