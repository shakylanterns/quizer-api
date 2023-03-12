import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CurrentUserMiddleware } from "../user/middlwares/current-user.middleware";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { CardController } from "./card.controller";
import { Card } from "./card.entity";
import { CardService } from "./card.service";

@Module({
  controllers: [CardController],
  imports: [TypeOrmModule.forFeature([Card, User])],
  providers: [CardService, UserService]
})
export class CardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
