import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = (ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => getCurrentUser(ctx),
);
