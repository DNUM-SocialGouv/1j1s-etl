import { Environment, SentryConfiguration } from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

type TaskConfiguration = {
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

export class ConfigurationFactory {
    public static createRoot(): { evenementsExtraction: Configuration } {
        return { evenementsExtraction: ConfigurationFactory.create() };
    }

    public static create(): Configuration {
        const { getOrError, getOrDefault } = ConfigurationFactory;
        const DEFAULT_MINIO_PORT = "9000";
        const DEFAULT_LOG_LEVEL = "debug";
        const DEFAULT_HISTORY_DIRECTORY_NAME = "history";

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
            LOGGER_LOG_LEVEL: getOrDefault("EVENTS_EXTRACT_LOG_LEVEL", DEFAULT_LOG_LEVEL) as LogLevel,
            MINIO: {
                ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
                HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", DEFAULT_HISTORY_DIRECTORY_NAME),
                PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
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
