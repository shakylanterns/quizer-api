import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("CardController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const addUser = async () => {
    const name = "Jason";
    const password = "1234";
    const resp = await request(app.getHttpServer())
      .post("/user/register")
      .send({ name, password });
    const cookie = resp.get("Set-Cookie");
    return cookie;
  };

  it("adds a card", async () => {
    const question = "What is 1 + 1?";
    const answer = "2";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer });
    expect(response.body.question).toBe(question);
    expect(response.body.answer).toBe(answer);
  });

  it("removes a card", async () => {
    const question = "What is 1 + 1?";
    const answer = "2";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer });
    await request(app.getHttpServer())
      .delete(`/card/${response.body.id}`)
      .set("Cookie", cookie);
    await request(app.getHttpServer())
      .get(`/card/${response.body.id}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("update a card", async () => {
    const question = "What is 1 + 1?";
    const answer = "2";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer });
    const newQuestion = "What is 1 + 2?";
    const newAnswer = "3";
    const resp = await request(app.getHttpServer())
      .patch(`/card/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ question: newQuestion, answer: newAnswer });
    expect(resp.body.question).toBe(newQuestion);
    expect(resp.body.answer).toBe(newAnswer);
    const findResp = await request(app.getHttpServer())
      .get(`/card/${response.body.id}`)
      .set("Cookie", cookie);
    expect(findResp.body.question).toBe(newQuestion);
    expect(findResp.body.answer).toBe(newAnswer);
  });

  it("gets a card", async () => {
    const question = "What is 1 + 1?";
    const answer = "2";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer });
    const getResp = await request(app.getHttpServer())
      .get(`/card/${response.body.id}`)
      .set("Cookie", cookie);
    expect(getResp.body.question).toBe(question);
    expect(getResp.body.answer).toBe(answer);
  });
});
