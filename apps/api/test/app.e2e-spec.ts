import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import request from "supertest";

import { ApiModule } from "@api/src/api.module";

describe("ApiController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
});
