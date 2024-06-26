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
	FEATURE_FLIPPING_CHARGEMENT: boolean
	FLOWS: Array<string>
	HELLOWORK: TaskConfiguration
	JOBTEASER: TaskConfiguration
	LOGGER_LOG_LEVEL: LogLevel
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
}

export class ConfigurationFactory extends ConfigurationValidator {
	public static createRoot(): { stagesChargement: Configuration } {
		return { stagesChargement: ConfigurationFactory.create() };
	}

	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean } = ConfigurationFactory;
		const DEFAULT_MINIO_PORT = "9000";

		return {
			CONTEXT: "chargement",
			DOMAINE: "Stages",
			FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("INTERNSHIPS_FEATURE_FLIPPING_CHARGEMENT", "false")),
			FLOWS: [
				getOrError("INTERNSHIPS_JOBTEASER_NAME"),
				getOrError("INTERNSHIPS_HELLOWORK_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
			],
			HELLOWORK: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_HELLOWORK_DIRECTORY_NAME", "hellowork"),
				NAME: getOrDefault("INTERNSHIPS_HELLOWORK_NAME", "hellowork"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_HELLOWORK_TRANSFORMED_FILE_EXTENSION"),
			},
			JOBTEASER: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				NAME: getOrDefault("INTERNSHIPS_JOBTEASER_NAME", "jobteaser"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				RESULT_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RESULT_BUCKET_NAME"),
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
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_STAGEFR_COMPRESSED_DIRECTORY_NAME", "stagefr_compresse"),
				NAME: getOrDefault("INTERNSHIPS_STAGEFR_COMPRESSED_NAME", "stagefr_compresse"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_TRANSFORMED_FILE_EXTENSION"),
			},
			STAGEFR_UNCOMPRESSED: {
				DIRECTORY_NAME: getOrDefault("INTERNSHIPS_STAGEFR_UNCOMPRESSED_DIRECTORY_NAME", "stagefr_decompresse"),
				NAME: getOrDefault("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME", "stagefr_decompresse"),
				TRANSFORMED_FILE_EXTENSION: getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_TRANSFORMED_FILE_EXTENSION"),
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
}
