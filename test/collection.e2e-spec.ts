import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("CollectionController (e2e)", () => {
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

  it("adds a collection", async () => {
    const name = "Hello World";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name });
    expect(response.body.name).toBe(name);
  });

  it("removes a collection", async () => {
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name: "testing" });
    await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name: "testing" });
    await request(app.getHttpServer())
      .delete(`/collection/${response.body.id}`)
      .set("Cookie", cookie);
    await request(app.getHttpServer())
      .get(`/collection/${response.body.id}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("update a collection", async () => {
    const name = "original";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name });
    const newName = "new name!";
    const resp = await request(app.getHttpServer())
      .patch(`/collection/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ name: newName });
    expect(resp.body.name).toBe(newName);
    const findResp = await request(app.getHttpServer())
      .get(`/collection/${response.body.id}`)
      .set("Cookie", cookie);
    expect(findResp.body.name).toBe(newName);
  });

  it("gets a collection", async () => {
    const name = "freedom";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name });
    const getResp = await request(app.getHttpServer())
      .get(`/collection/${response.body.id}`)
      .set("Cookie", cookie);
    expect(getResp.body.name).toBe(name);
  });

  it("adds a card to the collection", async () => {
    const name = "first collection";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name });
    const question = "What is 2 + 2?";
    const answer = "4";
    const cardResp = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/collection/add/${response.body.id}/${cardResp.body.id}`)
      .set("Cookie", cookie)
      .expect(201);
    await request(app.getHttpServer())
      .post(`/collection/add/${response.body.id}/${cardResp.body.id}`)
      .set("Cookie", cookie)
      .expect(201);
    const getResp = await request(app.getHttpServer())
      .get(`/collection/${response.body.id}`)
      .set("Cookie", cookie)
      .expect(200);
    expect(getResp.body.cards).toHaveLength(1);
  });

  it("removes a card from the collection", async () => {
    const name = "first collection";
    const cookie = await addUser();
    const response = await request(app.getHttpServer())
      .post("/collection")
      .set("Cookie", cookie)
      .send({ name });
    const question = "What is 2 + 2?";
    const answer = "4";
    const cardResp = await request(app.getHttpServer())
      .post("/card")
      .set("Cookie", cookie)
      .send({ question, answer })
      .expect(201);
    // add a card first, then remove it
    await request(app.getHttpServer())
      .post(`/collection/add/${response.body.id}/${cardResp.body.id}`)
      .set("Cookie", cookie)
      .expect(201);
    await request(app.getHttpServer())
      .delete(`/collection/remove/${response.body.id}/${cardResp.body.id}`)
      .set("Cookie", cookie)
      .expect(200);
    const getResp = await request(app.getHttpServer())
      .get(`/collection/${response.body.id}`)
      .set("Cookie", cookie)
      .expect(200);
    expect(getResp.body.cards).toHaveLength(0);
  });
});
