import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";

import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import { Configuration, ConfigurationFactory } from "@evenements/src/chargement/infrastructure/configuration/configuration";
import { EvenementsChargementLoggerStrategy } from "@evenements/src/chargement/infrastructure/configuration/logger-strategy";
import {
	StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import {
	FeatureFlippingEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/feature-flipping-evenements.repository";
import {
	MinioAndStrapiEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Shared],
	providers: [{
		provide: EvenementsChargementLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsChargementLoggerStrategy => {
			return new EvenementsChargementLoggerStrategy(configurationService.get<Configuration>("evenementsChargement"));
		},
	}, {
		provide: "UnJeuneUneSolution.EvenementsRepository",
		inject: [
			ConfigService,
			Client,
			DateService,
			EvenementsChargementLoggerStrategy,
			"FileSystemClient",
			JsonContentParser,
			"UuidGenerator",
		],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			dateService: DateService,
			loggerStrategy: EvenementsChargementLoggerStrategy,
			fileSystemClient: FileSystemClient,
			contentParser: JsonContentParser,
			uuidGenerator: UuidGenerator,
		): UnJeuneUneSolution.EvenementsRepository => {
			const configuration = configurationService.get<Configuration>("evenementsChargement");
			const axiosInstance = axios.create({
				baseURL: configuration.STRAPI.BASE_URL,
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});
			const authenticationClient = new AuthenticationClient(
				configuration.STRAPI.AUTHENTICATION_URL,
				{
					username: configuration.STRAPI.USERNAME,
					password: configuration.STRAPI.PASSWORD,
				},
			);
			const strapiEvenementHttpClient = new StrapiEvenementHttpClient(
				axiosInstance,
				authenticationClient,
				configuration.STRAPI.EVENEMENT_URL,
			);

			if (configurationService.get("FEATURE_FLIPPING_CHARGEMENT")) {
				return new FeatureFlippingEvenementsRepository(
					minioClient,
					strapiEvenementHttpClient,
					configuration,
					loggerStrategy,
					uuidGenerator,
					dateService,
				);
			} else {
				return new MinioAndStrapiEvenementsRepository(
					minioClient,
					strapiEvenementHttpClient,
					configuration,
					fileSystemClient,
					contentParser,
					loggerStrategy,
					uuidGenerator,
					dateService,
				);
			}
		},
	}],
	exports: [EvenementsChargementLoggerStrategy, "UnJeuneUneSolution.EvenementsRepository"],
})
export class Gateways {
}
