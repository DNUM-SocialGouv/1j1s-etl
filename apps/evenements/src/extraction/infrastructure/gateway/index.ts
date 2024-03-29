import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";

import { FluxRepository } from "@evenements/src/extraction/domain/service/flux.repository";
import {
	Configuration,
	ConfigurationFactory,
} from "@evenements/src/extraction/infrastructure/configuration/configuration";
import {
	EvenementsExtractionLoggerStrategy,
} from "@evenements/src/extraction/infrastructure/configuration/logger.strategy";
import {
	TousMobilisesBasicFlowHttpClient,
} from "@evenements/src/extraction/infrastructure/gateway/client/tous-mobilises-basic-flow-http.client";
import {
	MinioHttpFlowRepository,
} from "@evenements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { Shared } from "@shared/src";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Shared,
	],
	providers: [{
		provide: EvenementsExtractionLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsExtractionLoggerStrategy => {
			const configuration = configurationService.get<Configuration>("evenementsExtraction");
			return new EvenementsExtractionLoggerStrategy(configuration);
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
			const configuration = configurationService.get<Configuration>("evenementsExtraction");
			const httpClient = axios.create({
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});

			const eventsBasicFlowHttpClient = new TousMobilisesBasicFlowHttpClient(httpClient, configuration);

			return new MinioHttpFlowRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				eventsBasicFlowHttpClient,
				new EvenementsExtractionLoggerStrategy(configuration),
			);
		},
	}],
	exports: ["FluxRepository"],
})
export class Gateways {
}
