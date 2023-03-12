import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { Card } from "./card.entity";

@Injectable()
export class CardService {
  constructor(@InjectRepository(Card) private repo: Repository<Card>) {}

  async create(question: string, answer: string, user: User): Promise<Card> {
    const card = this.repo.create({ question, answer });
    card.owner = user;
    return this.repo.save(card);
  }

  async findOne(id: number, user: User): Promise<Card | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      relations: { owner: true },
      where: { owner: { id: user.id }, id }
    });
  }

  async findByQuestion(question: string, user: User): Promise<Card | null> {
    if (!question) {
      return null;
    }
    return this.repo.findOne({
      relations: { owner: true },
      where: { owner: { id: user.id }, question }
    });
  }

  async findByOwner(userId: number): Promise<Card[]> {
    return this.repo.find({
      relations: { owner: true },
      where: { owner: { id: userId } }
    });
  }

  async update(
    id: number,
    attributes: Partial<Card>,
    user: User
  ): Promise<Card | null> {
    const card = await this.repo.findOne({
      relations: { owner: true },
      where: { id, owner: { id: user.id } }
    });
    if (!card) {
      return null;
    }
    Object.assign(card, attributes);
    return await this.repo.save(card);
  }

  async remove(id: number, user: User): Promise<Card | null> {
    const card = await this.repo.findOne({
      relations: { owner: true },
      where: { id, owner: { id: user.id } }
    });
    if (!card) {
      return null;
    }
    return this.repo.remove(card);
  }
}
