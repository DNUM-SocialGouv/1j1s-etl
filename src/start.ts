import * as http from "http";
import { Client } from "minio";

import { ConfigurationFactory } from "@configuration/configuration";
import { LoggerFactory } from "@shared/configuration/logger";
import { MinioAdminStorageRepository } from "@shared/infrastructure/gateway/repository/minio-admin-storage.repository";
import { Setup } from "@configuration/setup";

const configuration = ConfigurationFactory.create();
const loggerFactory = new LoggerFactory(
	configuration.SENTRY.DSN,
	configuration.SENTRY.PROJECT,
	configuration.SENTRY.RELEASE,
	configuration.NODE_ENV,
	configuration.APPLICATION_CONTEXT,
	configuration.APPLICATION_LOGGER_LOG_LEVEL,
	configuration.DOMAIN,
);
const applicationLogger = loggerFactory.create({ name: configuration.APPLICATION_LOGGER_NAME });
const minioClient = new Client({
	accessKey: configuration.MINIO.ACCESS_KEY,
	secretKey: configuration.MINIO.SECRET_KEY,
	port: configuration.MINIO.PORT,
	endPoint: configuration.MINIO.URL,
});

const adminStorageClient = new MinioAdminStorageRepository(minioClient);
const setup = new Setup(configuration, applicationLogger, adminStorageClient);

const server = http.createServer();
server.listen(process.env.PORT);

setup.init().catch(() => process.exit(1));
