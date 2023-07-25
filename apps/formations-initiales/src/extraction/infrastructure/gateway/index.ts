import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AxiosInstance } from "axios";
import { Client } from "minio";

import { Configuration, ConfigurationFactory } from "@formations-initiales/src/extraction/infrastructure/configuration/configuration";
import {
  FormationsInitialesExtractionLoggerStrategy,
} from "@formations-initiales/src/extraction/infrastructure/configuration/logger.strategy";
import {
  OnisepFlowHttpClient,
} from "@formations-initiales/src/extraction/infrastructure/gateway/client/onisep-flow-http.client";
import {
  MinioHttpFlowRepository,
} from "@formations-initiales/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
    imports: [
      ConfigModule.forRoot({
        load: [ConfigurationFactory.createRoot],
        envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
      }),
      Shared,
    ],
  providers: [
    {
      provide: OctetStreamHttpClient,
      inject: ["AxiosInstance", ConfigService, "FileSystemClient", "UuidGenerator"],
      useFactory: (
        axios: AxiosInstance,
        configurationService: ConfigService,
        fileSystemClient: FileSystemClient,
        uuidGenerator: UuidGenerator,
      ): OctetStreamHttpClient => {
        const configuration = configurationService.get<Configuration>("onisepExtraction");
        return new OctetStreamHttpClient(axios, fileSystemClient, uuidGenerator, configuration.TEMPORARY_DIRECTORY_PATH);
      },
    },
    {
      provide: OnisepFlowHttpClient,
      inject: [OctetStreamHttpClient, StreamZipClient, "FileSystemClient"],
      useFactory: (
        octetStreamHttpClient: OctetStreamHttpClient,
        streamZipClient: StreamZipClient,
        fileSystemClient: FileSystemClient,
      ): OnisepFlowHttpClient => {
        return new OnisepFlowHttpClient(
          octetStreamHttpClient,
          streamZipClient,
          fileSystemClient,
        );
      },
    },
    {
      provide: FormationsInitialesExtractionLoggerStrategy,
      inject: [ConfigService],
      useFactory: (configurationService: ConfigService): FormationsInitialesExtractionLoggerStrategy => {
        const configuration = configurationService.get<Configuration>("onisepExtraction");
        return new FormationsInitialesExtractionLoggerStrategy(configuration);
      },
    },
    {
      provide: "FluxRepository",
      inject: [
        ConfigService,
        Client,
        "FileSystemClient",
        "UuidGenerator",
        OnisepFlowHttpClient,
        FormationsInitialesExtractionLoggerStrategy,
      ],
      useFactory: (
        configurationService: ConfigService,
        minioClient: Client,
        fileSystemClient: FileSystemClient,
        uuidGenerator: UuidGenerator,
        onisepFlowHttpClient: OnisepFlowHttpClient,
        loggerStrategy: LoggerStrategy,
      ): MinioHttpFlowRepository => {
        return new MinioHttpFlowRepository(
          configurationService.get("onisepExtraction"),
          minioClient,
          fileSystemClient,
          uuidGenerator,
          onisepFlowHttpClient,
          loggerStrategy,
        );
      },
    },
  ],
  exports: ["FluxRepository"],
})
export class Gateways {
}
