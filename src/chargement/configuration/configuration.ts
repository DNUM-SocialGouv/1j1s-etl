import { Environment } from "@configuration/configuration";
import { LogLevel } from "@shared/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	PORT: number
	RESULT_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

type SentryConfiguration = {
	DSN: string
	PROJECT: string
}

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	NAME: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	FEATURE_FLIPPING_CHARGEMENT: boolean
	JOBTEASER: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	RELEASE: string,
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
}

export class ConfigurationFactory {
	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean } = ConfigurationFactory;
		const DEFAULT_TRANSFORMED_BUCKET_NAME = "json";
		const DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION = ".json";
		const DEFAULT_RESULT_BUCKET_NAME = "result";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("FEATURE_FLIPPING_CHARGEMENT", "false")),
			JOBTEASER: {
				DIRECTORY_NAME: getOrDefault("JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				NAME: getOrDefault("JOBTEASER_NAME", "jobteaser"),
				TRANSFORMED_FILE_EXTENSION: getOrError("JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("LOAD_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RESULT_BUCKET_NAME: getOrDefault("MINIO_RESULT_BUCKET_NAME", DEFAULT_RESULT_BUCKET_NAME),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrDefault("MINIO_TRANSFORMED_BUCKET_NAME", DEFAULT_TRANSFORMED_BUCKET_NAME),
				TRANSFORMED_FILE_EXTENSION: getOrDefault("MINIO_TRANSFORMED_FILE_EXTENSION", DEFAULT_MINIO_TRANSFORMED_FILE_EXTENSION),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			RELEASE: getOrError("npm_package_version"),
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("SENTRY_PROJECT"),
			},
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_COMPRESSED_DIRECTORY_NAME", "stagefr_compresse"),
				NAME: getOrDefault("STAGEFR_COMPRESSED_NAME", "stagefr_compresse"),
				TRANSFORMED_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_UNCOMPRESSED_DIRECTORY_NAME", "stagefr_decompresse"),
				NAME: getOrDefault("STAGEFR_UNCOMPRESSED_NAME", "stagefr_decompresse"),
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
