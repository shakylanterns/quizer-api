import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  UseGuards
} from "@nestjs/common";
import { Serializer } from "../interceptors/serializer.interceptor";
import { AuthService } from "./auth/auth.service";
import { LoggedInUser } from "./decorators/logged-in-user.decorator";
import { LoginUserDto } from "./dtos/login-user.dto";
import { RegisteruserDto } from "./dtos/register-user.dto";
import { ReturnUserDto } from "./dtos/return-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller("user")
@Serializer(ReturnUserDto)
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Get("/me")
  @UseGuards(AuthGuard)
  me(@LoggedInUser() user: User) {
    return user;
  }

  @Post("/register")
  async register(@Body() body: RegisteruserDto, @Session() session: any) {
    const user = await this.authService.register(body.name, body.password);
    if (!user) {
      throw new BadRequestException("name already taken");
    }
    session.userId = user.id;
    return user;
  }

  @Post("/login")
  @HttpCode(200)
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(body.name, body.password);
    if (!user) {
      throw new BadRequestException("username or password incorrect");
    }
    session.userId = user.id;
    return user;
  }

  @Post("/logout")
  @HttpCode(200)
  async logout(@Session() session: any) {
    session.userId = null;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found!`);
    }
    return user;
  }

  @Delete("/:id")
  async remove(@Param("id") id: string) {
    const user = await this.userService.remove(parseInt(id));
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found!`);
    }
    return user;
  }

  @Patch("/:id")
  async update(@Body() body: UpdateUserDto, @Param("id") id: string) {
    const user = await this.userService.update(parseInt(id), body);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found!`);
    }
    return user;
  }
}
