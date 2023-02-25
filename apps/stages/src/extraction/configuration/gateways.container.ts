import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AxiosInstance } from "axios";
import { Client } from "minio";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { BasicFlowHttpClient } from "@shared/src/infrastructure/gateway/client/basic-flow-http.client";
import { CompressedFlowHttpClient } from "@shared/src/infrastructure/gateway/client/compressed-flow-http.client";
import { FlowStrategy } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { OctetStreamFlowHttpClient } from "@shared/src/infrastructure/gateway/client/octet-stream-flow-http.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@shared/src/infrastructure/gateway/unzip.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

import { Configuration, ConfigurationFactory } from "@stages/src/extraction/configuration/configuration";
import { StagesExtractionLoggerStrategy } from "@stages/src/extraction/configuration/logger.strategy";
import { StagesOnFlowNameStrategy } from "@stages/src/extraction/infrastructure/gateway/client/flow.strategy";
import {
	MinioHttpFlowRepository,
} from "@stages/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Shared],
	providers: [
		{
			provide: OctetStreamHttpClient,
			inject: ["AxiosInstance", ConfigService, "FileSystemClient", "UuidGenerator"],
			useFactory: (
				axios: AxiosInstance,
				configurationService: ConfigService,
				fileSystemClient: FileSystemClient,
				uuidGenerator: UuidGenerator,
			): OctetStreamHttpClient => {
				const configuration = configurationService.get<Configuration>("stagesExtraction");
				return new OctetStreamHttpClient(axios, fileSystemClient, uuidGenerator, configuration.TEMPORARY_DIRECTORY_PATH);
			},
		}, {
			provide: BasicFlowHttpClient,
			inject: ["AxiosInstance"],
			useFactory: (axios: AxiosInstance): BasicFlowHttpClient => new BasicFlowHttpClient(axios),
		},
		{
			provide: CompressedFlowHttpClient,
			inject: [OctetStreamHttpClient, UnzipClient],
			useFactory: (octetStreamHttpClient: OctetStreamHttpClient, unzipClient: UnzipClient): CompressedFlowHttpClient => {
				return new CompressedFlowHttpClient(octetStreamHttpClient, unzipClient);
			},
		},
		{
			provide: OctetStreamFlowHttpClient,
			inject: [OctetStreamHttpClient],
			useFactory: (octetStreamHttpClient: OctetStreamHttpClient): OctetStreamFlowHttpClient => {
				return new OctetStreamFlowHttpClient(octetStreamHttpClient);
			},
		},
		{
			provide: StagesOnFlowNameStrategy,
			inject: [ConfigService, BasicFlowHttpClient, CompressedFlowHttpClient, OctetStreamFlowHttpClient],
			useFactory: (
				configurationService: ConfigService,
				basicFlowHttpClient: BasicFlowHttpClient,
				compressedFlowHttpClient: CompressedFlowHttpClient,
				octetStreamFlowHttpClient: OctetStreamFlowHttpClient,
			): FlowStrategy => {
				const configuration = configurationService.get<Configuration>("stagesExtraction");
				return new StagesOnFlowNameStrategy(configuration, basicFlowHttpClient, compressedFlowHttpClient, octetStreamFlowHttpClient);
			},
		},
		{
			provide: StagesExtractionLoggerStrategy,
			inject: [ConfigService],
			useFactory: (configurationService: ConfigService): StagesExtractionLoggerStrategy => {
				return new StagesExtractionLoggerStrategy(configurationService.get<Configuration>("stagesExtraction"));
			},
		},
		{
			provide: "FluxRepository",
			inject: [
				ConfigService,
				Client,
				"FileSystemClient",
				"UuidGenerator",
				StagesOnFlowNameStrategy,
				StagesExtractionLoggerStrategy,
			],
			useFactory: (
				configurationService: ConfigService,
				minioClient: Client,
				fileSystemClient: FileSystemClient,
				uuidGenerator: UuidGenerator,
				flowStrategy: FlowStrategy,
				loggerStrategy: LoggerStrategy,
			): MinioHttpFlowRepository => {
				return new MinioHttpFlowRepository(
					configurationService.get<Configuration>("stagesExtraction"),
					minioClient,
					fileSystemClient,
					uuidGenerator,
					flowStrategy,
					loggerStrategy,
				);
			},
		},
	],
	exports: ["FluxRepository"],
})
export class Gateways {
}
