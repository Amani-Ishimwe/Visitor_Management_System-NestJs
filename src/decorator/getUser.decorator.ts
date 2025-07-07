import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx:ExecutionContext): any =>{
        const request: { user: any } = ctx.switchToHttp().getRequest();
        if(data) return request.user[data];
        return request.user
    }
)


 