import { IsString, MinLength } from "class-validator";

export class AddCardDto {
  @MinLength(1)
  @IsString()
  question: string;

  @MinLength(1)
  @IsString()
  answer: string;
}
