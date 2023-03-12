import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../user.entity";
import { UserService } from "../user.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      findByName: (name: string) => {
        return Promise.resolve(users.find((u) => u.name === name));
      },
      create: (name, password) => {
        const user = users.find((u) => u.name === name);
        if (user) {
          return null;
        }
        const made: User = {
          name,
          password,
          id: users.length,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: []
        };
        users.push(made);
        return Promise.resolve(made);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("register without name collision is fine, and the password is hashed", async () => {
    const name = "hello";
    const password = "asdf";
    const actual = await service.register(name, password);
    expect(actual.name).toEqual(name);
    expect(actual.password).not.toEqual(password);
  });

  it("register with name collision should be unsuccessful", async () => {
    const name = "hello";
    const password = "asdf";
    await service.register(name, password);
    // use the same name again
    const actual = await service.register(name, password);
    expect(actual).toBeNull();
  });

  it("log in with correct name", async () => {
    const name = "hello";
    const password = "asdf";
    await service.register(name, password);
    const actual = await service.login(name, password);
    expect(actual).not.toBeNull();
  });

  it("log in with incorrect name", async () => {
    const actual = await service.login("does not exist", "");
    expect(actual).toBeNull();
  });

  it("log in with incorrect password", async () => {
    const name = "hello";
    await service.register(name, "aaa");
    const actual = await service.login(name, "");
    expect(actual).toBeNull();
  });
});
