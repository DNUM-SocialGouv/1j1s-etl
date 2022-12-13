import { Environment, SentryConfiguration } from "@configuration/configuration";
import { LogLevel } from "@shared/configuration/logger";

export type MinioConfiguration = {
    ACCESS_KEY: string
	PORT: number
	RESULT_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}


export type Flow = {
    NAME: string,
    EXTENSION: string
}

export type StrapiConguration = {
    AUTHENTICATION_URL: string
    BASE_URL: string
    EVENEMENT_URL: string
    PASSWORD: string
    USERNAME: string
}

export type Configuration = {
	LOGGER_LOG_LEVEL: LogLevel;
	NODE_ENV: Environment;
	SENTRY: SentryConfiguration;
    CONTEXT: string
    FLOWS: Array<string>
    IMMOJEUNE: Flow
    MINIO: MinioConfiguration
    STRAPI: StrapiConguration
	TEMPORARY_FILE_PATH: string
}

export class ConfigurationFactory {

    public static create(): Configuration {
        const { getOrError, getOrDefault } = ConfigurationFactory;

        const DEFAULT = {
            MINIO_PORT: "9000",
			TEMPORARY_FILE_PATH: "/tmp/",
        };

        return <Configuration>{
			CONTEXT: "chargement",
			FLOWS: [
				"immojeune",
			],
			IMMOJEUNE: {
				NAME: getOrError("IMMOJEUNE_FLOW_NAME"),
				EXTENSION: getOrError("IMMOJEUNE_EXTENTION_LOAD"),
			},
			LOGGER_LOG_LEVEL: getOrError("HOUSING_LOGGER_LOG_LEVEL"),
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT.MINIO_PORT)),
				RESULT_BUCKET_NAME: getOrError("HOUSING_MINIO_RESULT_BUCKET_NAME"),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrError("HOUSING_MINIO_TRANSFORMED_BUCKET_NAME"),
				TRANSFORMED_FILE_EXTENSION: getOrError("MINIO_TRANSFORMED_FILE_EXTENSION"),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV"),
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				EVENEMENT_URL: getOrError("HOUSING_STRAPI_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
			TEMPORARY_FILE_PATH: getOrDefault("TEMPORARY_FILE_PATH", DEFAULT.TEMPORARY_FILE_PATH),
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

	private static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}


