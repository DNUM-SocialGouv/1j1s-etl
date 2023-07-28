import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { XMLParser } from "fast-xml-parser";
import { Client } from "minio";

import {
  FormationsInitialesRepository,
} from "@formations-initiales/src/transformation/domain/service/formations-initiales.repository";
import {
  Configuration,
  ConfigurationFactory,
} from "@formations-initiales/src/transformation/infrastructure/configuration/configuration";
import {
  FormationsInitialesTransformationLoggerStrategy,
} from "@formations-initiales/src/transformation/infrastructure/configuration/logger-strategy";
import {
  MinioFormationsInitialesRepository,
} from "@formations-initiales/src/transformation/infrastructure/gateway/repository/minio-formations-initiales.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParser, XmlContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigurationFactory.createRoot],
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    }),
    Shared,
  ],
  providers: [{
    provide: FormationsInitialesTransformationLoggerStrategy,
    inject: [ConfigService],
    useFactory: (configurationService: ConfigService): FormationsInitialesTransformationLoggerStrategy => {
      const configuration = configurationService.get<Configuration>("formationsInitialesTransformation");
      return new FormationsInitialesTransformationLoggerStrategy(configuration);
    },
  },
  {
    provide: "ContentParser",
    useValue: new XmlContentParser(new XMLParser({ trimValues: true })),
  },
  {
    provide: "FormationsInitialesRepository",
    inject: [
      ConfigService,
      Client,
      "FileSystemClient",
      "UuidGenerator",
      DateService,
      FormationsInitialesTransformationLoggerStrategy,
      "ContentParser",
    ],
    useFactory: (
      configurationService: ConfigService,
      minioClient: Client,
      fileSystemClient: FileSystemClient,
      uuidGenerator: UuidGenerator,
      dateService: DateService,
      loggerStrategy: FormationsInitialesTransformationLoggerStrategy,
      contentParser: ContentParser,
    ): FormationsInitialesRepository => {
      return new MinioFormationsInitialesRepository(
        configurationService.get<Configuration>("formationsInitialesTransformation"),
        minioClient,
        fileSystemClient,
        uuidGenerator,
        dateService,
        loggerStrategy,
        contentParser,
      );
    },
  }],
  exports: ["FormationsInitialesRepository"],
})
export class Gateways {
}
