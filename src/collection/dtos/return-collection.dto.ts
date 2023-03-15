import { Expose, Transform } from "class-transformer";
import { Card } from "../../card/card.entity";

export class ReturnCollectionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Transform(({ obj }) => {
    return obj.owner ? obj.owner.id : undefined;
  })
  @Expose()
  userId: number;

  @Transform(({ obj }) => {
    if (obj.cards) {
      return obj.cards.map((c: Card) => c.id);
    }
    return [];
  })
  @Expose()
  cardIds: number;
}
