import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Card } from "../card/card.entity";
import { User } from "../user/user.entity";
import { Collection } from "./collection.entity";

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection) private repo: Repository<Collection>,
    @InjectRepository(Card) private cardRepo: Repository<Card>
  ) {}

  async create(name: string, user: User): Promise<Collection> {
    const coll = this.repo.create({ name });
    coll.owner = user;
    return this.repo.save(coll);
  }

  async findOne(id: number, user: User): Promise<Collection | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      relations: { owner: true, cards: true },
      where: { owner: { id: user.id }, id }
    });
  }

  async findByName(name: string, user: User): Promise<Collection | null> {
    if (!name) {
      return null;
    }
    return this.repo.findOne({
      relations: { owner: true, cards: true },
      where: { owner: { id: user.id }, name }
    });
  }

  async findByOwner(userId: number): Promise<Collection[]> {
    return this.repo.find({
      relations: { owner: true },
      where: { owner: { id: userId } }
    });
  }

  async update(
    id: number,
    attributes: Partial<Collection>,
    user: User
  ): Promise<Collection | null> {
    const coll = await this.repo.findOne({
      relations: { owner: true },
      where: { id, owner: { id: user.id } }
    });
    if (!coll) {
      return null;
    }
    Object.assign(coll, attributes);
    return await this.repo.save(coll);
  }

  async remove(id: number, user: User): Promise<Collection | null> {
    const coll = await this.repo.findOne({
      relations: { owner: true },
      where: { id, owner: { id: user.id } }
    });
    if (!coll) {
      return null;
    }
    return this.repo.remove(coll);
  }

  async addCard(
    id: number,
    cardId: number,
    user: User
  ): Promise<Collection | null> {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) {
      return null;
    }
    const coll = await this.repo.findOne({
      relations: { owner: true, cards: true },
      where: { id, owner: { id: user.id } }
    });
    if (!coll) {
      return null;
    }
    coll.cards.push(card);
    await this.repo.save(coll);
  }

  async removeCard(
    id: number,
    cardId: number,
    user: User
  ): Promise<Collection | null> {
    const coll = await this.repo.findOne({
      relations: { owner: true, cards: true },
      where: { id, owner: { id: user.id } }
    });
    if (!coll) {
      return null;
    }
    // remove that card
    coll.cards = coll.cards.filter((c) => c.id !== cardId);
    await this.repo.save(coll);
  }
}
