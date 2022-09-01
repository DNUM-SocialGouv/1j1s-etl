import "dotenv/config";
import "module-alias/register";

import * as http from "http";
import { Client } from "minio";

import { ConfigurationFactory } from "@configuration/configuration";
import { LoggerFactory } from "@shared/configuration/logger";
import { MinioAdminStorageRepository } from "@shared/infrastructure/gateway/repository/minio-admin-storage.repository";
import { Setup } from "@configuration/setup";

const configuration = ConfigurationFactory.create();
const applicationLogger = LoggerFactory.create({
	name: configuration.APPLICATION_LOGGER_NAME,
	logLevel: configuration.APPLICATION_LOGGER_LOG_LEVEL,
});
const minioClient = new Client({
	accessKey: configuration.MINIO_ACCESS_KEY,
	secretKey: configuration.MINIO_SECRET_KEY,
	port: configuration.MINIO_PORT,
	endPoint: configuration.MINIO_URL,
});

const adminStorageClient = new MinioAdminStorageRepository(minioClient);
const setup = new Setup(configuration, applicationLogger, adminStorageClient);

const server = http.createServer();
server.listen(process.env.PORT);

setup.init().catch(() => process.exit(1));
