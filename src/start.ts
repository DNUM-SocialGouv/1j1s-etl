import "dotenv/config";
import "module-alias/register";

import * as http from "http";

import { ConfigurationFactory } from "@configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { LoggerFactory } from "@shared/configuration/logger";
import { MinioAdminStorageRepository } from "@shared/infrastructure/gateway/repository/minio-admin-storage.repository";
import { Setup } from "@configuration/setup";

const configuration = ConfigurationFactory.create();
const applicationLogger = LoggerFactory.create({
	name: configuration.APPLICATION_LOGGER_NAME,
	logLevel: configuration.APPLICATION_LOGGER_LOG_LEVEL,
});
const gatewayContainer = GatewayContainerFactory.create(configuration);
const adminStorageClient = new MinioAdminStorageRepository(gatewayContainer.minioClient);
const setup = new Setup(configuration, applicationLogger, adminStorageClient);

const server = http.createServer();
server.listen(process.env.PORT);

setup.init().catch(() => process.exit(1));
