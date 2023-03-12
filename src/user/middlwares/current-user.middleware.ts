import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { User } from "../user.entity";
import { UserService } from "../user.service";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

declare module "express" {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // session may be null?
    const { userId } = req.session || {};

    // the modified request object will be reflected inside the handler
    if (userId) {
      const user = await this.userService.findOne(userId);
      req.user = user;
    }
    next();
  }
}
