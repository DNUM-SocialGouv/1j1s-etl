import axios from "axios";
import { Client } from "minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

import {
	Configuration,
	ConfigurationFactory,
	MinioConfiguration,
	TaskConfiguration,
} from "@evenements/src/extraction/configuration/configuration";
import { Domaine, LogLevel } from "@shared/src/configuration/logger";
import { Environment, SentryConfiguration } from "@configuration/src/configuration";
import { EvenementsExtractionLoggerStrategy } from "@evenements/src/extraction/configuration/logger.strategy";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { FluxRepository } from "@evenements/src/extraction/domain/service/flux.repository";
import {
	MinioHttpFlowRepository,
} from "@evenements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { Shared } from "@shared/src";
import {
	TousMobilisesBasicFlowHttpClient,
} from "@evenements/src/extraction/infrastructure/gateway/client/tous-mobilises-basic-flow-http.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.create] }),
		Shared,
	],
	providers: [{
		provide: EvenementsExtractionLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsExtractionLoggerStrategy => {
			return new EvenementsExtractionLoggerStrategy({
				CONTEXT: configurationService.get<string>("CONTEXT"),
				DOMAINE: configurationService.get<Domaine>("DOMAINE"),
				FLOWS: configurationService.get<Array<string>>("FLOWS"),
				LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
				MINIO: configurationService.get<MinioConfiguration>("MINIO"),
				NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
				SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
				TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
				TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
			});
		},
	}, {
		provide: "FluxRepository",
		inject: [ConfigService, Client, "FileSystemClient", "UuidGenerator"],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			fileSystemClient: FileSystemClient,
			uuidGenerator: UuidGenerator,
		): FluxRepository => {
			const moduleConfiguration: Configuration = {
				CONTEXT: configurationService.get<string>("CONTEXT"),
				DOMAINE: configurationService.get<Domaine>("DOMAINE"),
				FLOWS: configurationService.get<Array<string>>("FLOWS"),
				LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
				MINIO: configurationService.get<MinioConfiguration>("MINIO"),
				NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
				SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
				TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
				TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
			};
			const httpClient = axios.create({
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});

			const eventsBasicFlowHttpClient = new TousMobilisesBasicFlowHttpClient(httpClient, moduleConfiguration);

			return new MinioHttpFlowRepository(
				moduleConfiguration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				eventsBasicFlowHttpClient,
				new EvenementsExtractionLoggerStrategy(moduleConfiguration),
			);
		},
	}],
	exports: ["FluxRepository"],
})
export class Gateways {
}
