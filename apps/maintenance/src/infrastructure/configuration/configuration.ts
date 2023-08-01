import {
	ConfigurationValidator,
	Environment,
	SentryConfiguration,
} from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

export type StrapiConfiguration = {
	AUTHENTICATION_URL: string
	BASE_URL: string
	INTERNSHIP_ENDPOINT: string
	HOUSING_ADS_ENDPOINT: string
	PASSWORD: string
	USERNAME: string
}

type BucketConfiguration = {
	BUCKET_NAME: string;
	DAYS_AFTER_EXPIRATION?: number;
}

type MinioConfiguration = {
	CONTACTS_MANAGEMENT_CEJ: BucketConfiguration;
	CONTACTS_MANAGEMENT_POE: BucketConfiguration;
	DEFAULT_DAYS_AFTER_EXPIRATION: number;
	FORMATIONS_INITIALES_EXTRACT: BucketConfiguration;
	FORMATIONS_INITIALES_TRANSFORM: BucketConfiguration;
	EVENTS_EXTRACT: BucketConfiguration;
	EVENTS_TRANSFORM: BucketConfiguration;
	EVENTS_LOAD: BucketConfiguration;
	HOUSING_EXTRACT: BucketConfiguration;
	HOUSING_TRANSFORM: BucketConfiguration;
	HOUSING_LOAD: BucketConfiguration;
	INTERNSHIPS_EXTRACT: BucketConfiguration;
	INTERNSHIPS_TRANSFORM: BucketConfiguration;
	INTERNSHIPS_LOAD: BucketConfiguration;
}

export type MaintenanceLoggerConfiguration = {
	CONTEXT: string,
	DOMAINE: Domaine,
	ENVIRONMENT: Environment,
	LOG_LEVEL: LogLevel,
	NAME: string
}

export type Configuration = {
	FLOWS: Array<string>
	LOGGER: MaintenanceLoggerConfiguration
	MINIO: MinioConfiguration
	SENTRY: SentryConfiguration
	STRAPI: StrapiConfiguration
}

export class ConfigurationFactory extends ConfigurationValidator {
	public static createRoot(): { maintenance: Configuration } {
		return { maintenance: ConfigurationFactory.create() };
	}

	public static create(): Configuration {
		const { getOrError } = ConfigurationFactory;

		return {
			FLOWS: [
				getOrError("INTERNSHIPS_JOBTEASER_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
				getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
				getOrError("HOUSING_IMMOJEUNE_NAME"),
				getOrError("HOUSING_STUDAPART_NAME"),
			],
			LOGGER: {
				CONTEXT: getOrError("MAINTENANCE_CONTEXT"),
				DOMAINE: "Maintenance",
				ENVIRONMENT: getOrError("NODE_ENV") as Environment,
				LOG_LEVEL: getOrError("MAINTENANCE_LOG_LEVEL") as LogLevel,
				NAME: getOrError("MAINTENANCE_LOGGER_NAME"),
			},
			MINIO: {
				CONTACTS_MANAGEMENT_CEJ: {
					BUCKET_NAME: getOrError("CONTACTS_MANAGEMENT_CEJ_MINIO_BUCKET_NAME"),
					DAYS_AFTER_EXPIRATION: Number(getOrError("CONTACTS_MANAGEMENT_CEJ_MINIO_DAYS_AFTER_EXPIRATION")),
				},
				CONTACTS_MANAGEMENT_POE: {
					BUCKET_NAME: getOrError("CONTACTS_MANAGEMENT_POE_MINIO_BUCKET_NAME"),
					DAYS_AFTER_EXPIRATION: Number(getOrError("CONTACTS_MANAGEMENT_POE_MINIO_DAYS_AFTER_EXPIRATION")),
				},
				DEFAULT_DAYS_AFTER_EXPIRATION: Number(getOrError("MINIO_DAYS_AFTER_EXPIRATION")),
				EVENTS_EXTRACT: { BUCKET_NAME: getOrError("EVENTS_MINIO_RAW_BUCKET_NAME") },
				EVENTS_TRANSFORM: { BUCKET_NAME: getOrError("EVENTS_MINIO_TRANSFORMED_BUCKET_NAME") },
				EVENTS_LOAD: { BUCKET_NAME: getOrError("EVENTS_MINIO_RESULT_BUCKET_NAME") },
				FORMATIONS_INITIALES_EXTRACT: { BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_RAW_BUCKET_NAME") },
				FORMATIONS_INITIALES_TRANSFORM: { BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_TRANSFORMED_BUCKET_NAME") },
				HOUSING_EXTRACT: { BUCKET_NAME: getOrError("HOUSING_MINIO_RAW_BUCKET_NAME") },
				HOUSING_TRANSFORM: { BUCKET_NAME: getOrError("HOUSING_MINIO_TRANSFORMED_BUCKET_NAME") },
				HOUSING_LOAD: { BUCKET_NAME: getOrError("HOUSING_MINIO_RESULT_BUCKET_NAME") },
				INTERNSHIPS_EXTRACT: { BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RAW_BUCKET_NAME") },
				INTERNSHIPS_TRANSFORM: { BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME") },
				INTERNSHIPS_LOAD: { BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RESULT_BUCKET_NAME") },
			},
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				INTERNSHIP_ENDPOINT: getOrError("STRAPI_OFFRE_DE_STAGE_URL"),
				HOUSING_ADS_ENDPOINT: getOrError("HOUSING_STRAPI_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
		};
	}
}
