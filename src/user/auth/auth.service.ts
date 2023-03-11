import { Injectable } from "@nestjs/common";
// argon2 does not have default export?
import * as argon2 from "argon2";
import { UserService } from "../user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(name: string, password: string) {
    const user = await this.userService.findByName(name);
    if (user) {
      return null;
    }
    try {
      const hash = await argon2.hash(password);
      const user = await this.userService.create(name, hash);
      return user;
    } catch (_) {
      return null;
    }
  }

  async login(name: string, password: string) {
    const user = await this.userService.findByName(name);
    if (!user) {
      return null;
    }

    try {
      if (await argon2.verify(user.password, password)) {
        return user;
      } else {
        return null;
      }
    } catch (_) {
      return null;
    }
  }
}
