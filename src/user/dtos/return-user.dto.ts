import { Expose } from "class-transformer";

export class ReturnUserDto {
  @Expose()
  name: string;

  @Expose()
  id: number;
}
