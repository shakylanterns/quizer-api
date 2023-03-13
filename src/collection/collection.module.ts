import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Card } from "../card/card.entity";
import { CurrentUserMiddleware } from "../user/middlwares/current-user.middleware";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { CollectionController } from "./collection.controller";
import { Collection } from "./collection.entity";
import { CollectionService } from "./collection.service";

@Module({
  controllers: [CollectionController],
  imports: [TypeOrmModule.forFeature([Collection, Card, User])],
  providers: [CollectionService, UserService]
})
export class CollectionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
