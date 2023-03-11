import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const LoggedInUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
