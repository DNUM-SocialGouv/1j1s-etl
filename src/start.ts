import * as http from "http";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { LoggerFactory } from "@shared/logger.factory";
import { MinioAdminStorageRepository } from "@shared/gateway/minio-admin-storage.repository";
import { Setup } from "./setup";

const configuration = ConfigurationFactory.create();
const applicationLogger = LoggerFactory.create(configuration);
const gatewayContainer = GatewayContainerFactory.create(configuration);
const adminStorageClient = new MinioAdminStorageRepository(gatewayContainer.minioClient);
const setup = new Setup(configuration, applicationLogger, adminStorageClient);

const server = http.createServer();
server.listen(process.env.PORT);

setup.init().catch(() => process.exit(1));
