import { Environment } from "@shared/src/infrastructure/configuration/configuration";
import { Domaine } from "@shared/src/infrastructure/configuration/logger";

type SentryConfiguration = {
	DSN: string
	PROJECT: string
	RELEASE: string
}

type SearchEngine = {
	API_KEY: string
	BATCH_SIZE: number
	HOST: URL
}

type StrapiConguration = {
	ENDPOINT: string
	AUTHENTICATION_URL: string
	PASSWORD: string
	USERNAME: string
}

export type Configuration = {
	DOMAINE: Domaine
	FEATURE_FLIPPING: boolean
	NODE_ENV: Environment
	SEARCH_ENGINE: SearchEngine
	SENTRY: SentryConfiguration
	STRAPI: StrapiConguration
}

export class ConfigurationFactory {
	public static create(): Configuration {
		const { getOrError, toBoolean } = ConfigurationFactory;

		return {
			DOMAINE: "Logements",
			FEATURE_FLIPPING: toBoolean(getOrError("INDEXATION_LOGEMENTS_FEATURE_FLIPPING")),
			NODE_ENV: <Environment>getOrError("NODE_ENV"),
			SEARCH_ENGINE: {
				API_KEY: getOrError("SEARCH_ENGINE_API_KEY"),
				BATCH_SIZE: Number(getOrError("SEARCH_ENGINE_BATCH_SIZE")),
				HOST: new URL(getOrError("SEARCH_ENGINE_HOST")),
			},
			SENTRY: {
				DSN: getOrError("SENTRY_DSN"),
				PROJECT: getOrError("npm_package_name"),
				RELEASE: getOrError("npm_package_version"),
			},
			STRAPI: {
				AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
				ENDPOINT: getOrError("INDEXATION_LOGEMENTS_ENDPOINT"),
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

	private static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}
