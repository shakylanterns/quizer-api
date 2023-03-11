import { Length } from "class-validator";

export class RegisteruserDto {
  @Length(1, 35)
  name: string;

  @Length(8, 35)
  password: string;
}
