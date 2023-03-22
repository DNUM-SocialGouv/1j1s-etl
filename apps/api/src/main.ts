import { NestFactory } from "@nestjs/core";

import { ApiModule } from "@api/src/api.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule);
  await app.listen(process.env.PORT);
}

bootstrap().catch((e) => console.error(e));
