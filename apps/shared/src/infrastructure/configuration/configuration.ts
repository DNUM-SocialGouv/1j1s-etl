import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

export enum Environment {
	DEVELOPMENT = "development",
	PRODUCTION = "production",
	RECETTE = "recette",
	TEST = "test"
}

type MinioConfiguration = {
	ACCESS_KEY: string
	DAYS_AFTER_EXPIRATION: number
	EVENTS_MINIO_RAW_BUCKET_NAME: string
	EVENTS_MINIO_RESULT_BUCKET_NAME: string
	EVENTS_MINIO_TRANSFORMED_BUCKET_NAME: string
	FORMATIONS_INITIALES_MINIO_RAW_BUCKET_NAME: string
	HISTORY_DIRECTORY_NAME: string
	HOUSING_MINIO_RAW_BUCKET_NAME: string
	HOUSING_MINIO_TRANSFORMED_BUCKET_NAME: string
	HOUSING_MINIO_RESULT_BUCKET_NAME: string
	INTERNSHIPS_MINIO_RAW_BUCKET_NAME: string
	INTERNSHIPS_MINIO_RESULT_BUCKET_NAME: string
	INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME: string
	LIFECYCLE_RULES_STATUS: "Enabled" | "Disabled"
	PORT: number
	SECRET_KEY: string
	TRANSFORMED_FILE_EXTENSION: string
	URL: string
}

export type SentryConfiguration = {
	DSN: string
	PROJECT: string
	RELEASE: string
}

export enum Domain {
	EVENTS = "events",
	HOUSING = "housing",
	INTERNSHIPS = "internships",
}

export type Configuration = {
	APPLICATION_LOGGER_NAME: string
	APPLICATION_LOGGER_LOG_LEVEL: LogLevel
	APPLICATION_CONTEXT: string
	DOMAIN: Domaine
	DOMAINS: Array<Domain>
	EVENTS: {
		EXTRACT_LOG_LEVEL: LogLevel
		FLOWS: Array<string>
		LOAD_LOG_LEVEL: LogLevel
		TRANSFORM_LOG_LEVEL: LogLevel
	},
	HOUSING: {
		EXTRACT_LOG_LEVEL: LogLevel
		FLOWS: Array<string>
		LOAD_LOG_LEVEL: LogLevel
		TRANSFORM_LOG_LEVEL: LogLevel
	},
	MINIO: MinioConfiguration
	NODE_ENV: Environment
	SENTRY: SentryConfiguration
	INTERNSHIPS: {
		EXTRACT_LOG_LEVEL: LogLevel
		FEATURE_FLIPPING_CHARGEMENT: boolean
		FLOWS: Array<string>
		LOAD_LOG_LEVEL: LogLevel
		TRANSFORM_LOG_LEVEL: LogLevel
	},
	STRAPI: {
		AUTHENTICATION_URL: string
		BASE_URL: string
		OFFRE_DE_STAGE_URL: string
		PASSWORD: string
		USERNAME: string
	}
	TEMPORARY_DIRECTORY_PATH: string
}

export abstract class ConfigurationValidator {
	protected static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			return defaultValue;
		}
		return environmentVariable;
	}

	protected static getOrError(environmentVariableKey: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
		}
		return environmentVariable;
	}

	protected static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}

	protected static toValidEnableStatus(value: string): "Enabled" | "Disabled" {
		return (value === "Enabled" || value === "Disabled") ? value : "Disabled";
	}
}

export class ConfigurationFactory extends ConfigurationValidator {
	public static create(): Configuration {
		const { getOrError, getOrDefault, toBoolean, toValidEnableStatus } = ConfigurationFactory;
		const DEFAULT_MINIO_PORT = "9000";
		const DOMAINS = [Domain.EVENTS, Domain.HOUSING, Domain.INTERNSHIPS];

		return {
			APPLICATION_LOGGER_NAME: getOrDefault("APPLICATION_LOGGER_NAME", "application"),
			APPLICATION_LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			APPLICATION_CONTEXT: "application",
			DOMAIN: "Global",
			DOMAINS,
			EVENTS: {
				EXTRACT_LOG_LEVEL: getOrDefault("EVENTS_EXTRACT_LOG_LEVEL", "debug") as LogLevel,
				FLOWS: [
					getOrError("EVENTS_TOUS_MOBILISES_NAME"),
				],
				LOAD_LOG_LEVEL: getOrDefault("EVENTS_LOAD_LOG_LEVEL", "debug") as LogLevel,
				TRANSFORM_LOG_LEVEL: getOrDefault("EVENTS_LOAD_LOG_LEVEL", "debug") as LogLevel,
			},
			HOUSING: {
				EXTRACT_LOG_LEVEL: getOrDefault("HOUSING_EXTRACT_LOG_LEVEL", "debug") as LogLevel,
				FLOWS: [
					getOrError("HOUSING_IMMOJEUNE_NAME"),
					getOrError("HOUSING_STUDAPART_NAME"),
				],
				LOAD_LOG_LEVEL: getOrDefault("HOUSING_LOAD_LOG_LEVEL", "debug") as LogLevel,
				TRANSFORM_LOG_LEVEL: getOrDefault("HOUSING_LOAD_LOG_LEVEL", "debug") as LogLevel,
			},
			MINIO: {
				ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
				DAYS_AFTER_EXPIRATION: Number(getOrError("MINIO_DAYS_AFTER_EXPIRATION")),
				EVENTS_MINIO_RAW_BUCKET_NAME: getOrError("EVENTS_MINIO_RAW_BUCKET_NAME"),
				EVENTS_MINIO_TRANSFORMED_BUCKET_NAME: getOrError("EVENTS_MINIO_TRANSFORMED_BUCKET_NAME"),
				EVENTS_MINIO_RESULT_BUCKET_NAME: getOrError("EVENTS_MINIO_RESULT_BUCKET_NAME"),
				FORMATIONS_INITIALES_MINIO_RAW_BUCKET_NAME: getOrError("FORMATIONS_INITIALES_MINIO_RAW_BUCKET_NAME"),
				HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
				HOUSING_MINIO_RAW_BUCKET_NAME: getOrError("HOUSING_MINIO_RAW_BUCKET_NAME"),
				HOUSING_MINIO_TRANSFORMED_BUCKET_NAME: getOrError("HOUSING_MINIO_TRANSFORMED_BUCKET_NAME"),
				HOUSING_MINIO_RESULT_BUCKET_NAME: getOrError("HOUSING_MINIO_RESULT_BUCKET_NAME"),
				INTERNSHIPS_MINIO_RAW_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RAW_BUCKET_NAME"),
				INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME"),
				INTERNSHIPS_MINIO_RESULT_BUCKET_NAME: getOrError("INTERNSHIPS_MINIO_RESULT_BUCKET_NAME"),
				LIFECYCLE_RULES_STATUS: toValidEnableStatus(getOrError("MINIO_LIFECYCLE_RULES_STATUS")),
				PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
				SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
				TRANSFORMED_FILE_EXTENSION: getOrError("MINIO_TRANSFORMED_FILE_EXTENSION"),
				URL: getOrError("MINIO_URL"),
			},
			NODE_ENV: getOrError("NODE_ENV") as Environment,
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			INTERNSHIPS: {
				EXTRACT_LOG_LEVEL: getOrError("INTERNSHIPS_EXTRACT_LOG_LEVEL") as LogLevel,
				FEATURE_FLIPPING_CHARGEMENT: toBoolean(getOrDefault("INTERNSHIPS_FEATURE_FLIPPING_CHARGEMENT", "false")),
				FLOWS: [
					getOrError("INTERNSHIPS_JOBTEASER_NAME"),
					getOrError("INTERNSHIPS_STAGEFR_COMPRESSED_NAME"),
					getOrError("INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME"),
				],
				LOAD_LOG_LEVEL: getOrError("INTERNSHIPS_LOAD_LOG_LEVEL") as LogLevel,
				TRANSFORM_LOG_LEVEL: getOrError("INTERNSHIPS_TRANSFORM_LOG_LEVEL") as LogLevel,
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
