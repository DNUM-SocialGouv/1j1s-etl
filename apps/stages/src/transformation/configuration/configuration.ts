import { Environment, SentryConfiguration } from "@configuration/src/configuration";

import { Domaine, LogLevel } from "@shared/src/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	HISTORY_DIRECTORY_NAME: string
	PORT: number
	RAW_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

type TaskConfiguration = {
	DIRECTORY_NAME: string
	NAME: string
	RAW_FILE_EXTENSION: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	CONTEXT: string
	DOMAINE: Domaine
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
	public static createRoot(): { stagesTransformation: Configuration } {
		return { stagesTransformation: ConfigurationFactory.create() };
	}

	public static create(): Configuration {
		const { getOrError, getOrDefault } = ConfigurationFactory;
		const DEFAULT_MINIO_PORT = "9000";

		return {
			CONTEXT: "transformation",
			DOMAINE: "Stages",
			FLOWS: [
				getOrError("INTERNSHIPS_JOBTEASER_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
			],
			JOBTEASER: {
				DIRECTORY_NAME: getOrError("INTERNSHIPS_JOBTEASER_DIRECTORY_NAME"),
				NAME: getOrError("INTERNSHIPS_JOBTEASER_NAME"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_JOBTEASER_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("INTERNSHIPS_TRANSFORM_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RAW_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RAW_BUCKET_NAME"),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME"),
				TRANSFORMED_FILE_EXTENSION: getOrError("MINIO_TRANSFORMED_FILE_EXTENSION"),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STAGEFR_COMPRESSED: {
				DIRECTORY_NAME: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_DIRECTORY_NAME"),
				NAME: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_DIRECTORY_NAME"),
				NAME: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
				RAW_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_TRANSFORMED_FILE_EXTENSION"),
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
