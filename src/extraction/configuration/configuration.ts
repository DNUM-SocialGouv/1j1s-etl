import { Environment } from "@configuration/configuration";
import { LogLevel } from "@shared/configuration/logger";

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	FLUX_URL: string
	NAME: string
	RAW_FILE_EXTENSION: string
}

export type Configuration = {
	JOBTEASER: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
	MINIO_ACCESS_KEY: string
	MINIO_HISTORY_DIRECTORY_NAME: string
	MINIO_PORT: number
	MINIO_RAW_BUCKET_NAME: string
	MINIO_SECRET_KEY: string
	MINIO_URL: string
	NODE_ENV: Environment
	SENTRY_DSN: string
	STAGEFR_COMPRESSED: TaskConfiguration
	STAGEFR_UNCOMPRESSED: TaskConfiguration
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory {
	static create(): Configuration {
		const { getOrError, getOrDefault } = ConfigurationFactory;
		const DEFAULT_RAW_BUCKET_NAME = "raw";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			JOBTEASER: {
				DIRECTORY_NAME: getOrDefault("JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				FLUX_URL: getOrError("JOBTEASER_FLUX_URL"),
				NAME: getOrDefault("JOBTEASER_NAME", "jobteaser"),
				RAW_FILE_EXTENSION: getOrError("JOBTEASER_RAW_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("EXTRACT_LOG_LEVEL", "debug") as LogLevel,
			SENTRY_DSN: getOrError("SENTRY_DSN"),
			MINIO_ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
			MINIO_HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
			MINIO_PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
			MINIO_RAW_BUCKET_NAME: getOrDefault("MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
			MINIO_SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
			MINIO_URL: getOrError("MINIO_URL"),
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_COMPRESSED_DIRECTORY_NAME", "stagefr_compresse"),
				FLUX_URL: getOrError("STAGEFR_COMPRESSED_FLUX_URL"),
				NAME: getOrDefault("STAGEFR_COMPRESSED_NAME", "stagefr_compresse"),
				RAW_FILE_EXTENSION: getOrError("STAGEFR_COMPRESSED_RAW_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrDefault("STAGEFR_UNCOMPRESSED_DIRECTORY_NAME", "stagefr_decompresse"),
				FLUX_URL: getOrError("STAGEFR_UNCOMPRESSED_FLUX_URL"),
				NAME: getOrDefault("STAGEFR_UNCOMPRESSED_NAME", "stagefr_decompresse"),
				RAW_FILE_EXTENSION: getOrError("STAGEFR_UNCOMPRESSED_RAW_FILE_EXTENSION"),
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
}
