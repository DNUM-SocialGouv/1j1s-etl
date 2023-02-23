import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Client } from "minio";

import { Environment, SentryConfiguration } from "@configuration/src/configuration";

import {
	ConfigurationFactory,
	MinioConfiguration,
	TaskConfiguration,
} from "@evenements/src/transformation/configuration/configuration";
import { EvenementsTransformationLoggerStrategy } from "@evenements/src/transformation/configuration/logger-strategy";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import {
	MinioEvenementRepository,
} from "@evenements/src/transformation/infrastructure/gateway/repository/minio-evenement.repository";

import { Shared } from "@shared/src";
import { Domaine, LogLevel } from "@shared/src/configuration/logger";
import { DateService } from "@shared/src/date.service";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.create] }),
		Shared,
	],
	providers: [{
		provide: EvenementsTransformationLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsTransformationLoggerStrategy => {
			return new EvenementsTransformationLoggerStrategy({
				CONTEXT: configurationService.get<string>("CONTEXT"),
				DOMAINE: configurationService.get<Domaine>("DOMAINE"),
				FLOWS: configurationService.get<Array<Domaine>>("FLOWS"),
				LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
				MINIO: configurationService.get<MinioConfiguration>("MINIO"),
				NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
				SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
				TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
				TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
			});
		},
	}, {
		provide: "EvenementsRepository",
		inject: [
			ConfigService,
			Client,
			"FileSystemClient",
			"UuidGenerator",
			DateService,
			EvenementsTransformationLoggerStrategy,
			JsonContentParser,
		],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			fileSystemClient: FileSystemClient,
			uuidGenerator: UuidGenerator,
			dateService: DateService,
			loggerStrategy: EvenementsTransformationLoggerStrategy,
			contentParser: JsonContentParser,
		): EvenementsRepository => {
			return new MinioEvenementRepository(
				{
					CONTEXT: configurationService.get<string>("CONTEXT"),
					DOMAINE: configurationService.get<Domaine>("DOMAINE"),
					FLOWS: configurationService.get<Array<Domaine>>("FLOWS"),
					LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
					MINIO: configurationService.get<MinioConfiguration>("MINIO"),
					NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
					SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
					TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
					TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
				},
				minioClient,
				fileSystemClient,
				uuidGenerator,
				dateService,
				loggerStrategy,
				contentParser,
			);
		},
	}],
	exports: ["EvenementsRepository"],
})
export class Gateways {
}
