import { LogLevel } from "@shared/configuration/logger";

export enum Environment {
	DEVELOPMENT = "development",
	PRODUCTION = "production",
	QUALIFICATION = "qualification"
}

type MinioConfiguration = {
	ACCESS_KEY: string
	DAYS_AFTER_EXPIRATION: number
	HISTORY_DIRECTORY_NAME: string
	LIFECYCLE_RULES_STATUS: "Enabled" | "Disabled"
	PORT: number
	RAW_BUCKET_NAME: string
	RESULT_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

export type SentryConfiguration = {
	DSN: string
	PROJECT: string
	RELEASE: string
}

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	FLUX_URL: string
	NAME: string
	RAW_FILE_EXTENSION: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	APPLICATION_LOGGER_NAME: string
	APPLICATION_LOGGER_LOG_LEVEL: LogLevel
	APPLICATION_CONTEXT: string
	EXTRACT_LOG_LEVEL: LogLevel
	FEATURE_FLIPPING_CHARGEMENT: boolean
	FLOWS: Array<string>
	JOBTEASER: TaskConfiguration
	LOAD_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	STAGEFR_COMPRESSED: TaskConfiguration
	STAGEFR_UNCOMPRESSED: TaskConfiguration
	STRAPI: {
		AUTHENTICATION_URL: string
		BASE_URL: string
		OFFRE_DE_STAGE_URL: string
		PASSWORD: string
		USERNAME: string
	}
	TEMPORARY_DIRECTORY_PATH: string
	TRANSFORM_LOG_LEVEL: LogLevel
}

export class ConfigurationFactory {
	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean, toValidEnableStatus } = ConfigurationFactory;
		const DEFAULT_RAW_BUCKET_NAME = "raw";
		const DEFAULT_TRANSFORMED_BUCKET_NAME = "json";
		const DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION = ".json";
		const DEFAULT_RESULT_BUCKET_NAME = "result";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			APPLICATION_LOGGER_NAME: getOrDefault("APPLICATION_LOGGER_NAME", "application"),
			APPLICATION_LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			APPLICATION_CONTEXT: "application",
			EXTRACT_LOG_LEVEL: getOrDefault("EXTRACT_LOG_LEVEL", "debug") as LogLevel,
			FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("FEATURE_FLIPPING_CHARGEMENT", "false")),
			FLOWS: [
				getOrError("JOBTEASER_NAME"),
				getOrError("STAGEFR_COMPRESSED_NAME"),
				getOrError("STAGEFR_UNCOMPRESSED_NAME"),
			],
			JOBTEASER: {
				DIRECTORY_NAME: getOrError("JOBTEASER_DIRECTORY_NAME"),
				FLUX_URL: getOrError("JOBTEASER_FLUX_URL"),
				NAME: getOrError("JOBTEASER_NAME"),
				RAW_FILE_EXTENSION: getOrError("JOBTEASER_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			LOAD_LOG_LEVEL: getOrDefault("LOAD_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				DAYS_AFTER_EXPIRATION: Number(getOrError("MINIO_DAYS_AFTER_EXPIRATION")),
				HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
				LIFECYCLE_RULES_STATUS: toValidEnableStatus(getOrError("MINIO_LIFECYCLE_RULES_STATUS")),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RAW_BUCKET_NAME: getOrDefault("MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
				RESULT_BUCKET_NAME: getOrDefault("MINIO_RESULT_BUCKET_NAME", DEFAULT_RESULT_BUCKET_NAME),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrDefault("MINIO_TRANSFORMED_BUCKET_NAME", DEFAULT_TRANSFORMED_BUCKET_NAME),
				TRANSFORMED_FILE_EXTENSION: getOrDefault("MINIO_TRANSFORMED_FILE_EXTENSION", DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrError("STAGEFR_COMPRESSED_DIRECTORY_NAME"),
				FLUX_URL: getOrError("STAGEFR_COMPRESSED_FLUX_URL"),
				NAME: getOrError("STAGEFR_COMPRESSED_NAME"),
				RAW_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrError("STAGEFR_UNCOMPRESSED_DIRECTORY_NAME"),
				FLUX_URL: getOrError("STAGEFR_UNCOMPRESSED_FLUX_URL"),
				NAME: getOrError("STAGEFR_UNCOMPRESSED_NAME"),
				RAW_FILE_EXTENSION: getOrError("STAGEFR_UNCOMPRESSED_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("STAGEFR_UNCOMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				OFFRE_DE_STAGE_URL: getOrError("STRAPI_OFFRE_DE_STAGE_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
			TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
			TRANSFORM_LOG_LEVEL: getOrDefault("TRANSFORM_LOG_LEVEL", "debug") as LogLevel,
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

	private static toValidEnableStatus(value: string): "Enabled" | "Disabled" {
		return (value === "Enabled" || value === "Disabled") ? value : "Disabled";
	}
}
