import { MinLength } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Collection } from "../collection/collection.entity";
import { User } from "../user/user.entity";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(1)
  question: string;

  @Column()
  @MinLength(1)
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: "CASCADE" })
  owner: User;

  @ManyToMany(() => Collection, (collection) => collection.cards)
  collections: Collection[];
}
