import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Client } from "minio";

import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import { Configuration, ConfigurationFactory } from "@evenements/src/transformation/infrastructure/configuration/configuration";
import { EvenementsTransformationLoggerStrategy } from "@evenements/src/transformation/infrastructure/configuration/logger-strategy";
import {
	MinioEvenementRepository,
} from "@evenements/src/transformation/infrastructure/gateway/repository/minio-evenement.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Shared,
	],
	providers: [{
		provide: EvenementsTransformationLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsTransformationLoggerStrategy => {
			const configuration = configurationService.get<Configuration>("evenementsTransformation");
			return new EvenementsTransformationLoggerStrategy(configuration);
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
				configurationService.get<Configuration>("evenementsTransformation"),
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
