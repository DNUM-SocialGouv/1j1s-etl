import {
  ConfigurationValidator,
  Environment,
  SentryConfiguration,
} from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

type MinioConfiguration = {
    ACCESS_KEY: string
    HISTORY_DIRECTORY_NAME: string
    PORT: number
    RAW_BUCKET_NAME: string
    SECRET_KEY: string
    URL: string
    TRANSFORMED_BUCKET_NAME: string
}

type TaskConfiguration = {
    DIRECTORY_NAME: string
    FLUX_URL: string
    NAME: string
    RAW_FILE_EXTENSION: string
    TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
    CONTEXT: string
    DOMAINE: Domaine
    FLOWS: Array<string>
    ONISEP: TaskConfiguration
    LOGGER_LOG_LEVEL: LogLevel
    MINIO: MinioConfiguration
    NODE_ENV: Environment
    SENTRY: SentryConfiguration
    TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory extends ConfigurationValidator {
  public static createRoot(): { formationsInitialesTransformation: Configuration } {
    return { formationsInitialesTransformation: ConfigurationFactory.create() };
  }

  public static create(): Configuration {
      const { getOrError, getOrDefault } = ConfigurationFactory;
      const DEFAULT_RAW_BUCKET_NAME = "raw";
      const DEFAULT_MINIO_PORT = "9000";
      const DEFAULT_ONISEP_NAME = "onisep";
      const DEFAULT_LOG_LEVEL = "debug";
      const DEFAULT_HISTORY_DIRECTORY_NAME = "history";

      return {
        CONTEXT: "formations-initiales/transformation",
        DOMAINE: "Formations initiales",
        FLOWS: [
          getOrError("FORMATIONS_INITIALES_ONISEP_NAME"),
        ],
        ONISEP: {
            DIRECTORY_NAME: getOrDefault("FORMATIONS_INITIALES_ONISEP_DIRECTORY_NAME", DEFAULT_ONISEP_NAME),
            FLUX_URL: getOrError("FORMATIONS_INITIALES_ONISEP_FLUX_URL"),
            NAME: getOrDefault("FORMATIONS_INITIALES_ONISEP_NAME", DEFAULT_ONISEP_NAME),
            RAW_FILE_EXTENSION: getOrDefault("FORMATIONS_INITIALES_ONISEP_RAW_FILE_EXTENSION", "xml"),
            TRANSFORMED_FILE_EXTENSION: getOrDefault("FORMATIONS_INITIALES_ONISEP_TRANSFORMED_FILE_EXTENSION", "json"),
        },
        LOGGER_LOG_LEVEL: getOrDefault("LOGGER_LOG_LEVEL", DEFAULT_LOG_LEVEL) as LogLevel,
        MINIO: {
            ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
            HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", DEFAULT_HISTORY_DIRECTORY_NAME),
            PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
            RAW_BUCKET_NAME: getOrDefault("EVENTS_MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
            SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
            URL: getOrError("MINIO_URL"),
            TRANSFORMED_BUCKET_NAME: getOrError("EVENTS_MINIO_TRANSFORMED_BUCKET_NAME"),
        },
        NODE_ENV: getOrError("NODE_ENV") as Environment,
        SENTRY: {
            DSN: getOrError("SENTRY_DSN"),
            PROJECT: getOrError("npm_package_name"),
            RELEASE: getOrError("npm_package_version"),
        },
        TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
      };
  }
}
