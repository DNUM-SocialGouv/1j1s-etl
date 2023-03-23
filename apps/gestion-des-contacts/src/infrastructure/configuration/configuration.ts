import {
	ConfigurationValidator,
	Environment,
	SentryConfiguration,
} from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

export type MinioConfiguration = {
	ACCESS_KEY: string;
	BUCKET_NAME_EXPORT_CEJ: string;
	BUCKET_NAME_EXPORT_POE: string;
	PORT: number;
	SECRET_KEY: string;
	URL: string;
}

//TODO grouper config FILR
export type Configuration = {
	CONTACTS_CEJ: {
		DOMAINE: Domaine;
		FEATURE_FLIPPING: boolean;
		FILR_PASSWORD: string;
		FILR_URL: string;
		FILR_USERNAME: string;
	}
	CONTACTS_POE: {
		DOMAINE: Domaine;
		FEATURE_FLIPPING: boolean;
		FILR_PASSWORD: string;
		FILR_URL: string;
		FILR_USERNAME: string;
	}
	CONTEXT: string;
	ENVIRONMENT: Environment;
	LOG_LEVEL: LogLevel
	MINIO: MinioConfiguration;
	SENTRY: SentryConfiguration;
	STRAPI: {
		CEJ_ENDPOINT: string;
		POE_ENDPOINT: string;
	}
	TEMPORARY_DIRECTORY_PATH: string;
}

export class ConfigurationFactory extends ConfigurationValidator {
	public static createRoot(): { gestionDesContacts: Configuration } {
		return {
			gestionDesContacts: ConfigurationFactory.create(),
		};
	}

	public static create(): Configuration {
		const { getOrError, toBoolean } = ConfigurationFactory;

		return {
			CONTACTS_CEJ: {
				DOMAINE: getOrError("CONTACTS_MANAGEMENT_CEJ_DOMAIN") as Domaine,
				FEATURE_FLIPPING: toBoolean(getOrError("CONTACTS_MANAGEMENT_CEJ_FEATURE_FLIPPING")),
				FILR_PASSWORD: getOrError("CONTACTS_MANAGEMENT_CEJ_FILR_PASSWORD"),
				FILR_URL: getOrError("CONTACTS_MANAGEMENT_CEJ_FILR_URL"),
				FILR_USERNAME: getOrError("CONTACTS_MANAGEMENT_CEJ_FILR_USERNAME"),
			},
			CONTACTS_POE: {
				DOMAINE: getOrError("CONTACTS_MANAGEMENT_POE_DOMAIN") as Domaine,
				FEATURE_FLIPPING: toBoolean(getOrError("CONTACTS_MANAGEMENT_POE_FEATURE_FLIPPING")),
				FILR_PASSWORD: getOrError("CONTACTS_MANAGEMENT_POE_FILR_PASSWORD"),
				FILR_URL: getOrError("CONTACTS_MANAGEMENT_POE_FILR_URL"),
				FILR_USERNAME: getOrError("CONTACTS_MANAGEMENT_POE_FILR_USERNAME"),
			},
			CONTEXT: "gestion-des-contacts",
			ENVIRONMENT: getOrError("NODE_ENV") as Environment,
			LOG_LEVEL: getOrError("CONTACTS_MANAGEMENT_LOG_LEVEL") as LogLevel,
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				BUCKET_NAME_EXPORT_CEJ: getOrError("CONTACTS_MANAGEMENT_CEJ_MINIO_BUCKET_NAME"),
				BUCKET_NAME_EXPORT_POE: getOrError("CONTACTS_MANAGEMENT_POE_MINIO_BUCKET_NAME"),
				PORT: Number(getOrError("MINIO_PORT")),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				URL: getOrError("MINIO_URL"),
			},
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				CEJ_ENDPOINT: getOrError("STRAPI_CEJ_ENDPOINT"),
				POE_ENDPOINT: getOrError("STRAPI_POE_ENDPOINT"),
			},
			TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
		};
	}
}
