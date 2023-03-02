import { Environment, SentryConfiguration } from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

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
	HOUSING_URL: string
	PASSWORD: string
	USERNAME: string
}

export type Configuration = {
	CONTEXT: string
	DOMAINE: Domaine
	FEATURE_FLIPPING: boolean
	FLOWS: Array<string>
	IMMOJEUNE: Flow
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	STRAPI: StrapiConguration
	STUDAPART: Flow
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory {
	public static createRoot(): { chargementLogements: Configuration } {
		return { chargementLogements: ConfigurationFactory.create() };
	}

	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean } = ConfigurationFactory;

		const DEFAULT = {
			MINIO_PORT: "9000",
			TEMPORARY_DIRECTORY_PATH: "/tmp/",
		};

		return <Configuration>{
			CONTEXT: "chargement",
			DOMAINE: "Logements",
			FEATURE_FLIPPING: toBoolean(getOrError("HOUSING_LOAD_FEATURE_FLIPPING")),
			FLOWS: [
				"immojeune",
				"studapart",
			],
			IMMOJEUNE: {
				NAME: getOrError("HOUSING_IMMOJEUNE_NAME"),
				EXTENSION: getOrError("HOUSING_IMMOJEUNE_RESULT_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrError("HOUSING_LOAD_LOG_LEVEL"),
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
			STUDAPART: {
				NAME: getOrError("HOUSING_STUDAPART_NAME"),
				EXTENSION: getOrError("HOUSING_STUDAPART_RESULT_FILE_EXTENSION"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				HOUSING_URL: getOrError("HOUSING_STRAPI_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
			TEMPORARY_DIRECTORY_PATH: getOrDefault("TEMPORARY_DIRECTORY_PATH", DEFAULT.TEMPORARY_DIRECTORY_PATH),
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
