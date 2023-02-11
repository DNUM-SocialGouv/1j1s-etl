import { Environment, SentryConfiguration, Validator } from "@shared/configuration";
import { Domaine, LogLevel } from "@shared/configuration/logger";

export type TaskConfiguration = {
    DIRECTORY_NAME: string
    FLUX_URL: string
    NAME: string
    RAW_FILE_EXTENSION: string
    AUTH_URL: string
    CLIENT_ID: string
    CLIENT_SECRET: string
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
    TOUS_MOBILISES: TaskConfiguration
    LOGGER_LOG_LEVEL: LogLevel
    MINIO: MinioConfiguration
    NODE_ENV: Environment
    SENTRY: SentryConfiguration
    TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory extends Validator {
    public static create(): Configuration {
        const { getOrError } = ConfigurationFactory;

        return {
            CONTEXT: "extraction",
            DOMAINE: "Évènements",
            FLOWS: [
                getOrError("EVENTS_TOUS_MOBILISES_NAME"),
            ],
            TOUS_MOBILISES: {
                DIRECTORY_NAME: getOrError("EVENTS_TOUS_MOBILISES_DIRECTORY_NAME"),
                FLUX_URL: getOrError("EVENTS_TOUS_MOBILISES_FLUX_URL"),
                NAME: getOrError("EVENTS_TOUS_MOBILISES_NAME"),
                RAW_FILE_EXTENSION: getOrError("EVENTS_TOUS_MOBILISES_RAW_FILE_EXTENSION"),
                AUTH_URL: getOrError("EVENTS_TOUS_MOBILISES_AUTH_URL"),
                CLIENT_ID: getOrError("EVENTS_TOUS_MOBILISES_CLIENT_ID"),
                CLIENT_SECRET: getOrError("EVENTS_TOUS_MOBILISES_CLIENT_SECRET"),
                SCOPE: getOrError("EVENTS_TOUS_MOBILISES_SCOPE").replaceAll(",", " "),
            },
            LOGGER_LOG_LEVEL: getOrError("EVENTS_EXTRACT_LOG_LEVEL") as LogLevel,
            MINIO: {
                ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
                HISTORY_DIRECTORY_NAME: getOrError("MINIO_HISTORY_DIRECTORY_NAME"),
                PORT: Number(getOrError("MINIO_PORT")),
                RAW_BUCKET_NAME: getOrError("EVENTS_MINIO_RAW_BUCKET_NAME"),
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
