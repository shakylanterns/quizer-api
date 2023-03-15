import { Expose, Transform } from "class-transformer";
import { Collection } from "../../collection/collection.entity";

export class ReturnUserDto {
  @Expose()
  name: string;

  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Transform(({ obj }) => {
    if (obj.collections) {
      return obj.collections.map((c: Collection) => c.id);
    }
    return [];
  })
  @Expose()
  collectionIds: number[];

  @Transform(({ obj }) => {
    if (obj.cards) {
      return obj.cards.map((c: Collection) => c.id);
    }
    return [];
  })
  @Expose()
  cardIds: number[];
}
