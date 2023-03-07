import { Environment, SentryConfiguration } from "@shared/src/infrastructure/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/infrastructure/configuration/logger";

export type StrapiConfiguration = {
	AUTHENTICATION_URL: string
	BASE_URL: string
	INTERNSHIP_ENDPOINT: string
	PASSWORD: string
	USERNAME: string
}

export type MaintenanceLoggerConfiguration = {
	CONTEXT: string,
	DOMAINE: Domaine,
	ENVIRONMENT: Environment,
	LOG_LEVEL: LogLevel,
	NAME: string
}

type Configuration = {
	LOGGER: MaintenanceLoggerConfiguration
	SENTRY: SentryConfiguration
	STRAPI: StrapiConfiguration
}

export class ConfigurationFactory {
	public static create(): Configuration {
		const { getOrError } = ConfigurationFactory;

		return {
			LOGGER: {
				CONTEXT: getOrError("MAINTENANCE_CONTEXT"),
				DOMAINE: "Maintenance",
				ENVIRONMENT: getOrError("NODE_ENV") as Environment,
				LOG_LEVEL: getOrError("MAINTENANCE_LOG_LEVEL") as LogLevel,
				NAME: getOrError("MAINTENANCE_LOGGER_NAME"),
			},
			SENTRY: {
				DSN: getOrError("MAINTENANCE_SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				BASE_URL: getOrError("STRAPI_BASE_URL"),
				INTERNSHIP_ENDPOINT: getOrError("STRAPI_INTERNSHIP_URL"),
				PASSWORD: getOrError("STRAPI_PASSWORD"),
				USERNAME: getOrError("STRAPI_USERNAME"),
			},
		};
	}

	private static getOrError(environmentVariableKey: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
		}
		return environmentVariable;
	}
}
