import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Card } from "./card/card.entity";
import { Collection } from "./collection/collection.entity";
import { User } from "./user/user.entity";

export const getDataSourceConfig = (database: string): TypeOrmModuleOptions => {
  return {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database,
    entities: [User, Card, Collection],
    synchronize: true
  };
};
