import {Controller} from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {AuthService} from "./auth.service";


@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    //@MessagePattern({cmd: "login"})
    //async login(@Ctx() context: RmqContext,
    //            @Payload() payload) {
    //    console.log(payload)
    //    return await this.authService.login(payload)
    //}
    @MessagePattern({cmd: "login"})
    async login(@Ctx() context: RmqContext,
                @Payload() payload) {
        console.log(payload)
        return this.authService.login(payload);
    }

    @MessagePattern({cmd: "logout"})
    logout(@Ctx() context: RmqContext,
           @Payload() payload) {
        this.authService.logout(payload);
    }
}
