import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AxiosInstance } from "axios";
import { Client } from "minio";

import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";
import { Configuration, ConfigurationFactory } from "@logements/src/extraction/infrastructure/configuration/configuration";
import { LogementsExtractionLoggerStrategy } from "@logements/src/extraction/infrastructure/configuration/logger.strategy";
import {
	HousingBasicFlowHttpClient,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client";
import {
	HousingsOnFlowNameStrategy,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-on-flow-name.strategy";
import {
	StudapartFtpFlowClient,
} from "@logements/src/extraction/infrastructure/gateway/client/studapart/studapart-ftp-flow.client";
import {
	MinioHttpFlowRepository,
} from "@logements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FlowStrategy } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FtpClient } from "@shared/src/infrastructure/gateway/client/ftp.client";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Shared],
	providers: [{
		provide: HousingBasicFlowHttpClient,
		inject: ["AxiosInstance"],
		useFactory: (axiosInstance: AxiosInstance): HousingBasicFlowHttpClient => new HousingBasicFlowHttpClient(axiosInstance),
	}, {
		provide: StudapartFtpFlowClient,
		inject: [ConfigService, FtpClient, StreamZipClient, "FileSystemClient"],
		useFactory: (
			configurationService: ConfigService,
			ftpClient: FtpClient,
			streamZipClient: StreamZipClient,
			fileSystemClient: FileSystemClient,
		): StudapartFtpFlowClient => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new StudapartFtpFlowClient(configuration, ftpClient, streamZipClient, fileSystemClient);
		},
	}, {
		provide: "FlowStrategy",
		inject: [ConfigService, HousingBasicFlowHttpClient, StudapartFtpFlowClient],
		useFactory: (
			configurationService: ConfigService,
			housingBasicFlowClient: HousingBasicFlowHttpClient,
			studapartFlowClient: StudapartFtpFlowClient,
		): FlowStrategy => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new HousingsOnFlowNameStrategy(configuration, housingBasicFlowClient, studapartFlowClient);
		},
	}, {
		provide: LogementsExtractionLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): LogementsExtractionLoggerStrategy => {
			return new LogementsExtractionLoggerStrategy(configurationService.get<Configuration>("extractionLogements"));
		},
	}, {
		provide: "FluxRepository",
		inject: [ConfigService, Client, "FileSystemClient", "UuidGenerator", "FlowStrategy", LogementsExtractionLoggerStrategy],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			fileSystemClient: FileSystemClient,
			uuidGenerator: UuidGenerator,
			flowStrategy: FlowStrategy,
			loggerStrategy: LoggerStrategy,
		): FluxRepository => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new MinioHttpFlowRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				flowStrategy,
				loggerStrategy,
			);
		},
	}],
	exports: ["FluxRepository"],
})
export class Gateways {
}

