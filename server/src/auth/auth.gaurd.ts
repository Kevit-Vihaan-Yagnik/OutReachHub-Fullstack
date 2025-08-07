import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate{
    constructor(private authService : AuthService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = req.headers['authorization'];

        if(!authHeader){
            throw new UnauthorizedException('Invalid token');
        }

        const token = authHeader.split(' ')[1];
        try{
            
            const payload = await this.authService.verifyToken(token);
            req['admin'] = payload;
            return true;

        }catch(err){
            throw new UnauthorizedException('Invalid credentials');
        }

    }
}