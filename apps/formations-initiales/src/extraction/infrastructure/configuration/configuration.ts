import {
  ConfigurationValidator,
  Environment,
  SentryConfiguration,
} from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

type TaskConfiguration = {
  DIRECTORY_NAME: string
  FLUX_URL: string
  NAME: string
  RAW_FILE_EXTENSION: string
  SCOPE: string
}

type MinioConfiguration = {
  ACCESS_KEY: string
  HISTORY_DIRECTORY_NAME: string
  PORT: number
  RAW_BUCKET_NAME: string
  SECRET_KEY: string
  URL: string
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
  public static createRoot(): { onisepExtraction: Configuration } {
    return { onisepExtraction: ConfigurationFactory.create() };
  }

  public static create(): Configuration {
    const { getOrError, getOrDefault } = ConfigurationFactory;
    const DEFAULT_MINIO_PORT = "9000";
    const DEFAULT_LOG_LEVEL = "debug";
    const DEFAULT_HISTORY_DIRECTORY_NAME = "history";

    return {
      CONTEXT: "extraction",
      DOMAINE: "Formations initiales",
      FLOWS: [
        getOrError("FORMATIONS_INITIALES_ONISEP_NAME"),
      ],
      ONISEP: {
        DIRECTORY_NAME: getOrError("FORMATIONS_INITIALES_ONISEP_DIRECTORY_NAME"),
        FLUX_URL: getOrError("FORMATIONS_INITIALES_ONISEP_FLUX_URL"),
        NAME: getOrError("FORMATIONS_INITIALES_ONISEP_NAME"),
        RAW_FILE_EXTENSION: getOrError("FORMATIONS_INITIALES_ONISEP_RAW_FILE_EXTENSION"),
        SCOPE: getOrError("EVENTS_TOUS_MOBILISES_SCOPE").replaceAll(",", " "),
      },
      LOGGER_LOG_LEVEL: getOrDefault("FORMATIONS_INITIALES_EXTRACT_LOG_LEVEL", DEFAULT_LOG_LEVEL) as LogLevel,
      MINIO: {
        ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
        HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", DEFAULT_HISTORY_DIRECTORY_NAME),
        PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
        RAW_BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_RAW_BUCKET_NAME"),
        SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
        URL: getOrError("MINIO_URL"),
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
