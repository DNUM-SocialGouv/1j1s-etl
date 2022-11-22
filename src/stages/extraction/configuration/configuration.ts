import { Environment, SentryConfiguration } from "@configuration/configuration";
import { LogLevel } from "@shared/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	HISTORY_DIRECTORY_NAME: string
	PORT: number
	RAW_BUCKET_NAME: string
	SECRET_KEY: string
	URL: string
}

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	FLUX_URL: string
	NAME: string
	RAW_FILE_EXTENSION: string
}

export type Configuration = {
	CONTEXT: string
	FLOWS: Array<string>
	JOBTEASER: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	STAGEFR_COMPRESSED: TaskConfiguration
	STAGEFR_UNCOMPRESSED: TaskConfiguration
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory {
	public static create(): Configuration {
		const { getOrError, getOrDefault } = ConfigurationFactory;
		const DEFAULT_RAW_BUCKET_NAME = "raw";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			CONTEXT: "extraction",
			FLOWS: [
				getOrError("INTERNSHIPS_JOBTEASER_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
			],
			JOBTEASER: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				FLUX_URL: getOrError("INTERNSHIPS_JOBTEASER_FLUX_URL"),
				NAME: getOrDefault("INTERNSHIPS_JOBTEASER_NAME", "jobteaser"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_JOBTEASER_RAW_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("INTERNSHIPS_EXTRACT_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RAW_BUCKET_NAME: getOrDefault("MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_STAGEFR_COMPRESSED_DIRECTORY_NAME", "stagefr_compresse"),
				FLUX_URL: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_FLUX_URL"),
				NAME: getOrDefault("INTERNSHIPS_STAGEFR_COMPRESSED_NAME", "stagefr_compresse"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_RAW_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_STAGEFR_UNCOMPRESSED_DIRECTORY_NAME", "stagefr_decompresse"),
				FLUX_URL: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_FLUX_URL"),
				NAME: getOrDefault("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME", "stagefr_decompresse"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_RAW_FILE_EXTENSION"),
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
