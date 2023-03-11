import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(name: string, password: string): Promise<User> {
    const user = this.repo.create({ name, password });
    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async findByName(name: string): Promise<User | null> {
    if (!name) {
      return null;
    }
    return this.repo.findOneBy({ name });
  }

  async update(id: number, attributes: Partial<User>): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      return null;
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.repo.remove(user);
  }
}
