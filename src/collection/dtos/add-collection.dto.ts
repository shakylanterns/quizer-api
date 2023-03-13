import { IsString, MinLength } from "class-validator";

export class AddCollectionDto {
  @IsString()
  @MinLength(1)
  name: string;
}
