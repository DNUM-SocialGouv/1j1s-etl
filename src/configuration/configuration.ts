import { LogLevel } from "@shared/configuration/logger";

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	FLUX_URL: string
	LOGGER_LOG_LEVEL: LogLevel
	NAME: string
	RAW_FILE_EXTENSION: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	APPLICATION_LOGGER_NAME: string
	APPLICATION_LOGGER_LOG_LEVEL: LogLevel
	FEATURE_FLIPPING_CHARGEMENT: boolean
	JOBTEASER: TaskConfiguration
	MINIO_ACCESS_KEY: string
	MINIO_DAYS_AFTER_EXPIRATION: number
	MINIO_HISTORY_DIRECTORY_NAME: string
	MINIO_LIFECYCLE_RULES_STATUS: "Enabled" | "Disabled"
	MINIO_PORT: number
	MINIO_RAW_BUCKET_NAME: string
	MINIO_RESULT_BUCKET_NAME: string
	MINIO_SECRET_KEY: string
	MINIO_TRANSFORMED_BUCKET_NAME: string
	MINIO_TRANSFORMED_FILE_EXTENSION: string
	MINIO_URL: string
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
}

export class ConfigurationFactory {
	static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean, toValidEnableStatus } = ConfigurationFactory;
		const DEFAULT_RAW_BUCKET_NAME = "raw";
		const DEFAULT_TRANSFORMED_BUCKET_NAME = "json";
		const DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION = ".json";
		const DEFAULT_RESULT_BUCKET_NAME = "result";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			APPLICATION_LOGGER_NAME: getOrDefault("APPLICATION_LOGGER_NAME", "application"),
			APPLICATION_LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("FEATURE_FLIPPING_CHARGEMENT", "false")),
			JOBTEASER: {
				DIRECTORY_NAME: getOrDefault("JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				FLUX_URL: getOrError("JOBTEASER_FLUX_URL"),
				LOGGER_LOG_LEVEL: getOrDefault("JOBTEASER_LOGGER_LOG_LEVEL", "debug") as LogLevel,
				NAME: getOrDefault("JOBTEASER_NAME", "jobteaser"),
				RAW_FILE_EXTENSION: getOrError("JOBTEASER_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			MINIO_ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
			MINIO_DAYS_AFTER_EXPIRATION: Number(getOrError("MINIO_DAYS_AFTER_EXPIRATION")),
			MINIO_HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
			MINIO_LIFECYCLE_RULES_STATUS: toValidEnableStatus(getOrError("MINIO_LIFECYCLE_RULES_STATUS")),
			MINIO_PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
			MINIO_RAW_BUCKET_NAME: getOrDefault("MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
			MINIO_RESULT_BUCKET_NAME: getOrDefault("MINIO_RESULT_BUCKET_NAME", DEFAULT_RESULT_BUCKET_NAME),
			MINIO_SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
			MINIO_TRANSFORMED_BUCKET_NAME: getOrDefault("MINIO_TRANSFORMED_BUCKET_NAME", DEFAULT_TRANSFORMED_BUCKET_NAME),
			MINIO_TRANSFORMED_FILE_EXTENSION: getOrDefault("MINIO_TRANSFORMED_FILE_EXTENSION", DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION),
			MINIO_URL: getOrError("MINIO_URL"),
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_COMPRESSED_DIRECTORY_NAME", "stagefr_compresse"),
				FLUX_URL: getOrError("STAGEFR_COMPRESSED_FLUX_URL"),
				LOGGER_LOG_LEVEL: getOrDefault("STAGEFR_COMPRESSED_LOGGER_LOG_LEVEL", "debug") as LogLevel,
				NAME: getOrDefault("STAGEFR_COMPRESSED_NAME", "stagefr_compresse"),
				RAW_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_UNCOMPRESSED_DIRECTORY_NAME", "stagefr_decompresse"),
				FLUX_URL: getOrError("STAGEFR_UNCOMPRESSED_FLUX_URL"),
				LOGGER_LOG_LEVEL: getOrDefault("STAGEFR_UNCOMPRESSED_LOGGER_LOG_LEVEL", "debug") as LogLevel,
				NAME: getOrDefault("STAGEFR_UNCOMPRESSED_NAME", "stagefr_decompresse"),
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
		};
	}

	static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			return defaultValue;
		}
		return environmentVariable;
	}

	static getOrError(environmentVariableKey: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
		}
		return environmentVariable;
	}

	static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}

	static toValidEnableStatus(value: string): "Enabled" | "Disabled" {
		return (value === "Enabled" || value === "Disabled") ? value : "Disabled";
	}
}
