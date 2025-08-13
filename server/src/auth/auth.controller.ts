import { Body, Controller, Post } from "@nestjs/common";
import { CreateAdminDto } from "./dto/createAdmin.dto";
import { AdminLoginDto } from "./dto/loginAdmin.dto";
import { AuthService } from "./auth.service";
import { LoginUserdto } from "./dto/loginUser.dto";
import { CreateUserDto } from "./dto/createUser.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}

    @Post('admin/register')
    async registerAdmin(@Body() createAdminDto : CreateAdminDto){
        return this.authService.registerAdmin(createAdminDto);
    }

    @Post('admin/login')
    async loginAdmin(@Body() AdminLoginDto : AdminLoginDto){
        return this.authService.loginAdmin(AdminLoginDto);
    }

    @Post('user/register')
    async registerUser(@Body() createUserDto : CreateUserDto){
        return this.authService.resgisterUser(createUserDto)
    }

    @Post('user/login')
    async loginUser(@Body() loginUserDto : LoginUserdto){
        return this.authService.loginUser(loginUserDto);
    }
}