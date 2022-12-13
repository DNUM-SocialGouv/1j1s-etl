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
			FLOWS: [
				"immojeune",
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
			STRAPI: {
				AUTHENTICATION_URL: "",
				BASE_URL: "",
				EVENEMENT_URL: "",
				PASSWORD: "",
				USERNAME: "",
				...strapiConguration,
			},
			TEMPORARY_FILE_PATH: "/tmp/",
		};

		return { ...defaults, ...configuration };
	}
}
