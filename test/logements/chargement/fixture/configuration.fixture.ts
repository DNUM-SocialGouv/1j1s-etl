import {
	Configuration,
	MinioConfiguration,
	StrapiConguration,
} from "@logements/chargement/configuration/configuration";
import { Environment, SentryConfiguration } from "@configuration/configuration";

export class ConfigurationFixtureBuilder {
	public static build(
		configuration?: Partial<Configuration>,
		strapiConguration?: Partial<StrapiConguration>,
		minioConfiguration?: Partial<MinioConfiguration>,
		sentryConfiguration?: Partial<SentryConfiguration>,
	): Configuration {
		const defaults: Configuration = {
			CONTEXT: "chargement",
			DOMAINE: "Logements",
			FEATURE_FLIPPING: true,
			FLOWS: [
				"immojeune",
				"studapart",
			],
			IMMOJEUNE: {
				NAME: "immojeune",
				EXTENSION: ".json",
			},
			LOGGER_LOG_LEVEL: "info",
			MINIO: {
				ACCESS_KEY: "",
				PORT: 0,
				RESULT_BUCKET_NAME: "",
				SECRET_KEY: "",
				TRANSFORMED_BUCKET_NAME: "",
				TRANSFORMED_FILE_EXTENSION: "",
				URL: "",
				...minioConfiguration,
			},
			NODE_ENV: Environment.DEVELOPMENT,
			SENTRY: {
				DSN: "",
				PROJECT: "logement-etl",
				RELEASE: "test",
				...sentryConfiguration,
			},
			STUDAPART: {
				NAME: "studapart",
				EXTENSION: ".json",
			},
			STRAPI: {
				AUTHENTICATION_URL: "",
				BASE_URL: "",
				HOUSING_URL: "",
				PASSWORD: "",
				USERNAME: "",
				...strapiConguration,
			},
			TEMPORARY_DIRECTORY_PATH: "/tmp/",
		};

		return { ...defaults, ...configuration };
	}
}
