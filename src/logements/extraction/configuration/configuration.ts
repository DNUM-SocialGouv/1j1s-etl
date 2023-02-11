import { Environment, SentryConfiguration, Validator } from "@shared/configuration";
import { Domaine, LogLevel } from "@shared/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	HISTORY_DIRECTORY_NAME: string
	PORT: number
	RAW_BUCKET_NAME: string
	SECRET_KEY: string
	URL: string
}

export type TaskConfiguration = {
	NAME: string
	RAW_FILE_EXTENSION: string
	URL: string
}

export type BasicAuth = {
	USERNAME: string,
	PASSWORD: string
}

export type Configuration = {
	CONTEXT: string
	DOMAINE: Domaine
	FLOWS: Array<string>
	IMMOJEUNE: TaskConfiguration
	STUDAPART: TaskConfiguration & BasicAuth
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory extends Validator {
	public static create(): Configuration {
		const { getOrError } = ConfigurationFactory;

		return {
			CONTEXT: "extraction",
			DOMAINE: "Logements",
			FLOWS: [
				getOrError("HOUSING_IMMOJEUNE_NAME"),
				getOrError("HOUSING_STUDAPART_NAME"),
			],
			IMMOJEUNE: {
				NAME: getOrError("HOUSING_IMMOJEUNE_NAME"),
				RAW_FILE_EXTENSION: getOrError("HOUSING_IMMOJEUNE_RAW_FILE_EXTENSION"),
				URL: getOrError("HOUSING_IMMOJEUNE_URL"),
			},
			STUDAPART: {
				NAME: getOrError("HOUSING_STUDAPART_NAME"),
				RAW_FILE_EXTENSION: getOrError("HOUSING_STUDAPART_RAW_FILE_EXTENSION"),
				URL: getOrError("HOUSING_STUDAPART_URL"),
				USERNAME: getOrError("HOUSING_STUDAPART_USERNAME"),
				PASSWORD: getOrError("HOUSING_STUDAPART_PASSWORD"),
			},
			LOGGER_LOG_LEVEL: getOrError("HOUSING_EXTRACT_LOG_LEVEL") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				HISTORY_DIRECTORY_NAME: getOrError("MINIO_HISTORY_DIRECTORY_NAME"),
				PORT: Number(getOrError("MINIO_PORT")),
				RAW_BUCKET_NAME: getOrError("HOUSING_MINIO_RAW_BUCKET_NAME"),
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
}
