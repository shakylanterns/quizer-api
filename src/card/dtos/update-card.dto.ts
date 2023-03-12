import { IsString, MinLength } from "class-validator";

export class UpdateCardDto {
  @MinLength(1)
  @IsString()
  question: string;

  @MinLength(1)
  @IsString()
  answer: string;
}
