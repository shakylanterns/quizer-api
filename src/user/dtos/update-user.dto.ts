import { IsOptional, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 35)
  name?: string;

  @IsOptional()
  @Length(8, 35)
  password?: string;
}
