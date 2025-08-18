import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// Removed unused imports for refresh logic

@Injectable()
export class AuthGaurd implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

        if (!authHeader) throw new UnauthorizedException('Missing token');

        const token = authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('Invalid authorization format');

        try {
            const payload = await this.authService.verifyToken(token);
            req[payload.isAdmin ? 'admin' : 'user'] = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}
