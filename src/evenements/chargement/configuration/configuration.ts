import { Environment, SentryConfiguration, Validator } from "@shared/configuration";
import { Domaine, LogLevel } from "@shared/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	PORT: number
	RESULT_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

export type TaskConfiguration = {
	DIRECTORY_NAME: string
	NAME: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	CONTEXT: string
	DOMAINE: Domaine
	FEATURE_FLIPPING_CHARGEMENT: boolean
	FLOWS: Array<string>
	TOUS_MOBILISES: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	STRAPI: {
		AUTHENTICATION_URL: string
		BASE_URL: string
		EVENEMENT_URL: string
		PASSWORD: string
		USERNAME: string
	}
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory extends Validator {
	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean } = ConfigurationFactory;
		const DEFAULT_MINIO_PORT = "9000";

		return {
			CONTEXT: "chargement",
			DOMAINE: "Évènements",
			FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("EVENTS_FEATURE_FLIPPING_CHARGEMENT", "false")),
			FLOWS: [
				getOrError("EVENTS_TOUS_MOBILISES_NAME"),
			],
			TOUS_MOBILISES: {
				DIRECTORY_NAME: getOrError("EVENTS_TOUS_MOBILISES_DIRECTORY_NAME"),
				NAME: getOrError("EVENTS_TOUS_MOBILISES_NAME"),
				TRANSFORMED_FILE_EXTENSION: getOrError("EVENTS_TOUS_MOBILISES_TRANSFORMED_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("LOAD_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RESULT_BUCKET_NAME: getOrError("EVENTS_MINIO_RESULT_BUCKET_NAME"),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrError("EVENTS_MINIO_TRANSFORMED_BUCKET_NAME"),
				TRANSFORMED_FILE_EXTENSION: getOrError("MINIO_TRANSFORMED_FILE_EXTENSION"),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				EVENEMENT_URL: getOrError("STRAPI_EVENEMENT_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
			TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
		};
	}

}
