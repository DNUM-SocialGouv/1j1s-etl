import {
	ConfigurationValidator,
	Environment,
	SentryConfiguration,
} from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

type MinioConfiguration = {
	ACCESS_KEY: string
	PORT: number
	RESULT_BUCKET_NAME: string
	SECRET_KEY: string
	TRANSFORMED_BUCKET_NAME: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

type TaskConfiguration = {
	DIRECTORY_NAME: string
	NAME: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	CONTEXT: string
	DOMAINE: Domaine
	FORMATIONS_INITIALES_LOAD_FEATURE_FLIPPING: boolean
	FLOWS: Array<string>
	ONISEP: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	STRAPI: {
		AUTHENTICATION_URL: string
		BASE_URL: string
		FORMATION_INITIALE_URL: string
		PASSWORD: string
		USERNAME: string
	}
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory extends ConfigurationValidator {
	public static createRoot(): { formationsInitialesChargement: Configuration } {
		return { formationsInitialesChargement: ConfigurationFactory.create() };
	}

	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean } = ConfigurationFactory;
		const DEFAULT_MINIO_PORT = "9000";

		return {
			CONTEXT: "chargement",
			DOMAINE: "Formations initiales",
			FORMATIONS_INITIALES_LOAD_FEATURE_FLIPPING: toBoolean(getOrDefault("FORMATIONS_INITIALES_LOAD_FEATURE_FLIPPING", "false")),
			FLOWS: [
				getOrError("FORMATIONS_INITIALES_ONISEP_NAME"),
			],
			ONISEP: {
				DIRECTORY_NAME: getOrError("FORMATIONS_INITIALES_ONISEP_DIRECTORY_NAME"),
				NAME: getOrError("FORMATIONS_INITIALES_ONISEP_NAME"),
				TRANSFORMED_FILE_EXTENSION: getOrError("FORMATIONS_INITIALES_ONISEP_TRANSFORMED_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RESULT_BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_RESULT_BUCKET_NAME"),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_TRANSFORMED_BUCKET_NAME"),
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
				FORMATION_INITIALE_URL: getOrError("STRAPI_FORMATION_INITIALE_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
			TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
		};
	}
}
