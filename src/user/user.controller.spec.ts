import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth/auth.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

describe("UserController", () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const randomUser: User = {
      id: 1,
      name: "hi",
      password: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
      collections: []
    };
    fakeUserService = {
      create: (name, password) =>
        Promise.resolve({
          id: 1,
          name,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
          collections: []
        }),
      findByName: () => Promise.resolve(randomUser),
      findOne: () => Promise.resolve(randomUser),
      remove: () => Promise.resolve(randomUser),
      update: () => Promise.resolve(randomUser)
    };
    fakeAuthService = {
      login: (name) =>
        Promise.resolve({
          name,
          password: "1234",
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
          collections: []
        }),
      register: () => Promise.resolve(randomUser)
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("register success", async () => {
    const name = "hi";
    const session: Record<string, any> = {};
    const user = await controller.register({ name, password: "bye" }, session);
    expect(user.name).toEqual(name);
    expect(session.userId).toBeDefined();
  });

  it("duplicate user throws bad request exception", async () => {
    // if there is no user created, register returns null
    fakeAuthService.register = () => Promise.resolve(null);
    const session: Record<string, any> = {};
    expect(
      controller.register({ name: "hi", password: "bye" }, session)
    ).rejects.toThrowError(BadRequestException);

    expect(session.userId).toBeUndefined();
  });

  it("login success", async () => {
    const name = "hi";
    const session: Record<string, any> = {};
    const user = await controller.login({ name, password: "bye" }, session);
    expect(user.name).toEqual(name);
    expect(session.userId).toBeDefined();
  });

  it("login failed should throw", async () => {
    // if there is no user created, login returns null
    fakeAuthService.login = () => Promise.resolve(null);
    const session: Record<string, any> = {};
    expect(
      controller.login({ name: "hi", password: "bye" }, session)
    ).rejects.toThrowError(BadRequestException);

    expect(session.userId).toBeUndefined();
  });

  it("logout removes session", async () => {
    const session: Record<string, any> = {
      userId: 1333
    };
    await controller.logout(session);
    expect(session.userId).toBeNull();
  });

  it("find user success", async () => {
    const user = await controller.findUser("1");
    expect(user.id).toBe(1);
  });

  it("find user fails", async () => {
    fakeUserService.findOne = () => Promise.resolve(null);
    expect(controller.findUser("1")).rejects.toThrowError(NotFoundException);
  });

  it("remove user success", async () => {
    // it returns the removed user
    const user = await controller.remove("1");
    expect(user.id).toBe(1);
  });

  it("remove user fails", async () => {
    fakeUserService.remove = () => Promise.resolve(null);
    expect(controller.remove("1")).rejects.toThrowError(NotFoundException);
  });

  it("update user success", async () => {
    // it returns the updated user
    const user = await controller.update({ name: "new name" }, "1");
    expect(user.id).toBe(1);
  });

  it("update user fails", async () => {
    fakeUserService.update = () => Promise.resolve(null);
    expect(controller.update({ name: "new name" }, "1")).rejects.toThrowError(
      NotFoundException
    );
  });
});
