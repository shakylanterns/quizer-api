import { Length } from "class-validator";

export class LoginUserDto {
  @Length(1, 35)
  name: string;

  @Length(8, 35)
  password: string;
}
