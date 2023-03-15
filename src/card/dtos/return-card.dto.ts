import { Expose, Transform } from "class-transformer";

export class ReturnCardDto {
  @Expose()
  id: number;

  @Expose()
  question: string;

  @Expose()
  answer: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Transform(({ obj }) => {
    return obj.owner ? obj.owner.id : undefined;
  })
  @Expose()
  userId: number;
}
