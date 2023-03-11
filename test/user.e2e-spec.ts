import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("signs up correctly", async () => {
    const name = "Jason";
    const resp = await request(app.getHttpServer())
      .post("/user/register")
      .send({ name, password: "12345602246rh" })
      .expect(201);
    expect(resp.body.name).toEqual(name);
    expect(resp.body.id).toBeDefined();
  });

  it("logins correctly", async () => {
    const name = "Jason";
    const password = "1234";
    await request(app.getHttpServer())
      .post("/user/register")
      .send({ name, password })
      .expect(201);
    const resp = await request(app.getHttpServer())
      .post("/user/login")
      .send({ name, password })
      .expect(200);
    expect(resp.body.name).toEqual(name);
  });

  it("get current user works", async () => {
    const name = "Jason";
    const password = "1234";
    const resp = await request(app.getHttpServer())
      .post("/user/register")
      .send({ name, password })
      .expect(201);
    const cookie = resp.get("Set-Cookie");
    const resp2 = await request(app.getHttpServer())
      .get("/user/me")
      .send({ name, password })
      .set("Cookie", cookie)
      .expect(200);
    expect(resp2.body.name).toEqual(name);
  });
});
