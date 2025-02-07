import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class Jwt_auth_guard implements CanActivate {

    constructor(private jwtService: JwtService) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            if (req.headers.authorization) {
                const authHeader = req.headers.authorization;
                const bearer = authHeader.split(' ')[0];
                const token = authHeader.split(' ')[1];
                if (bearer !== 'Bearer' || !token) {
                    throw new UnauthorizedException({message: 'Пользователь не авторизован'})
                }
                const user = this.jwtService.decode(token);
                req.user = user;
                return true;
            }
            return req.isAuthenticated()

        } catch (err) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован!!!!'})
        }
    }

}