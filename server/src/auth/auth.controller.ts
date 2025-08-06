import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserLoginDto } from "./dto/loginUser.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}

    @Post('register')
    async register(@Body() createUserDto : CreateUserDto){
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() userLoginDto : UserLoginDto){
        return this.authService.login(userLoginDto);
    }
}