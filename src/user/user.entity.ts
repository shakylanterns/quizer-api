import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Card } from "../card/card.entity";
import { Collection } from "../collection/collection.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Card, (card) => card.owner)
  cards: Card[];

  @OneToMany(() => Collection, (collection) => collection.owner)
  collections: Collection[];
}
