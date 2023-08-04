import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";

import {
  FormationsInitialesChargementRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales-chargement.repository";
import {
  Configuration,
  ConfigurationFactory,
} from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import {
  FormationsInitialesChargementLoggerStrategy,
} from "@formations-initiales/src/chargement/infrastructure/configuration/logger-strategy";
import {
  HttpClient,
  StrapiFormationInitialeHttpClient,
} from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";
import {
  FeatureFlippingFormationsInitialesRepository,
} from "@formations-initiales/src/chargement/infrastructure/gateway/repository/feature-flipping-formations-initiales.repository";
import {
  MinioAndStrapiFormationsInitialesRepository,
} from "@formations-initiales/src/chargement/infrastructure/gateway/repository/minio-and-strapi-formations-initiales.repository";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
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
    provide: AuthenticationClient,
    inject: [ConfigService],
    useFactory: (configurationService: ConfigService): AuthenticationClient => {
      const configuration = configurationService.get<Configuration>("formationsInitialesChargement");
      return new AuthenticationClient(
        configuration.STRAPI.AUTHENTICATION_URL,
        { username: configuration.STRAPI.USERNAME, password: configuration.STRAPI.PASSWORD },
      );
    },
  }, {
    provide: "HttpClient",
    inject: [ConfigService, AuthenticationClient],
    useFactory: (configurationService: ConfigService, authenticationClient: AuthenticationClient): HttpClient => {
      const configuration = configurationService.get<Configuration>("formationsInitialesChargement");
      const axiosInstance = axios.create({
        baseURL: configuration.STRAPI.BASE_URL,
      });
      return new StrapiFormationInitialeHttpClient(axiosInstance, authenticationClient, configuration.STRAPI.FORMATION_INITIALE_URL);
    },
  }, {
    provide: FormationsInitialesChargementLoggerStrategy,
    inject: [ConfigService],
    useFactory: (configurationService: ConfigService): LoggerStrategy => {
      return new FormationsInitialesChargementLoggerStrategy(configurationService.get<Configuration>("formationsInitialesChargement"));
    },
  }, {
    provide: "FormationsInitialesChargementRepository",
    inject: [
      ConfigService,
      Client,
      "HttpClient",
      "FileSystemClient",
      "UuidGenerator",
      FormationsInitialesChargementLoggerStrategy,
    ],
    useFactory: (
      configurationService: ConfigService,
      minioClient: Client,
      httpClient: HttpClient,
      fileSystemClient: FileSystemClient,
      uuidGenerator: UuidGenerator,
      loggerStrategy: FormationsInitialesChargementLoggerStrategy,
    ): FormationsInitialesChargementRepository => {
      const configuration = configurationService.get<Configuration>("formationsInitialesChargement");
      if (configuration.FORMATIONS_INITIALES_LOAD_FEATURE_FLIPPING) {
        return new FeatureFlippingFormationsInitialesRepository(
          configuration,
          minioClient,
          httpClient,
          fileSystemClient,
          uuidGenerator,
          loggerStrategy,
        );
      } else {
        return new MinioAndStrapiFormationsInitialesRepository(
          configuration,
          minioClient,
          httpClient,
          fileSystemClient,
          uuidGenerator,
          loggerStrategy,
        );
      }
    },
  }],
  exports: ["FormationsInitialesChargementRepository"],
})
export class Gateway {
}
