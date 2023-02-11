import { Environment, SentryConfiguration } from "@shared/configuration";
import { Domaine, LogLevel } from "@shared/configuration/logger";

type MinioConfiguration = {
    ACCESS_KEY: string
    HISTORY_DIRECTORY_NAME: string
    PORT: number
    RAW_BUCKET_NAME: string
    SECRET_KEY: string
    URL: string
    TRANSFORMED_BUCKET_NAME: string
}

export type TaskConfiguration = {
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
    TOUS_MOBILISES: TaskConfiguration
    LOGGER_LOG_LEVEL: LogLevel
    MINIO: MinioConfiguration
    NODE_ENV: Environment
    SENTRY: SentryConfiguration
    TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory {
    public static create(): Configuration {
        const { getOrError, getOrDefault } = ConfigurationFactory;
        const DEFAULT_RAW_BUCKET_NAME = "raw";
        const DEFAULT_MINIO_PORT = "9000";
        const DEFAULT_TOUS_MOBILISES_NAME = "tousmobilises";
        const DEFAULT_LOG_LEVEL = "debug";
        const DEFAULT_HISTORY_DIRECTORY_NAME = "history";

        return {
            CONTEXT: "evenements/extraction",
            DOMAINE: "Évènements",
            FLOWS: [
                getOrError("EVENTS_TOUS_MOBILISES_NAME"),
            ],
            TOUS_MOBILISES: {
                DIRECTORY_NAME: getOrDefault("EVENTS_TOUS_MOBILISES_DIRECTORY_NAME", DEFAULT_TOUS_MOBILISES_NAME),
                FLUX_URL: getOrError("EVENTS_TOUS_MOBILISES_FLUX_URL"),
                NAME: getOrDefault("EVENTS_TOUS_MOBILISES_NAME", DEFAULT_TOUS_MOBILISES_NAME),
                RAW_FILE_EXTENSION: getOrError("EVENTS_TOUS_MOBILISES_RAW_FILE_EXTENSION"),
                TRANSFORMED_FILE_EXTENSION: getOrError("EVENTS_TOUS_MOBILISES_TRANSFORMED_FILE_EXTENSION"),
            },
            LOGGER_LOG_LEVEL: getOrDefault("EVENTS_EXTRACT_LOG_LEVEL", DEFAULT_LOG_LEVEL) as LogLevel,
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

    private static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
        const environmentVariable = process.env[environmentVariableKey];
        if (!environmentVariable) {
            return defaultValue;
        }
        return environmentVariable;
    }

    private static getOrError(environmentVariableKey: string): string {
        const environmentVariable = process.env[environmentVariableKey];
        if (!environmentVariable) {
            throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
        }
        return environmentVariable;
    }
}
