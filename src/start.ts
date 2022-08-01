import * as http from "http";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { LoggerFactory } from "@transformation/configuration/logger";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { MinioAdminStorageClient } from "@shared/gateway/minio-admin-storage.client";

const configuration = ConfigurationFactory.create();
const applicationLogger = LoggerFactory.create(configuration);
const gatewayContainer = GatewayContainerFactory.create(configuration);
const adminStorageClient = new MinioAdminStorageClient(gatewayContainer.storages.minioClient);

const server = http.createServer();
server.listen(process.env.PORT);

adminStorageClient
	.createBucket(configuration.MINIO_RAW_BUCKET_NAME)
	.then(async () => {
		try {
			await adminStorageClient.createBucket(configuration.MINIO_JSON_BUCKET_NAME);
			applicationLogger.info("Création des seaux effectuées");
		} catch (e) {
			applicationLogger.error({ reason: "Echec dans la création du seau JSON" });
			throw e;
		}
	})
	.catch((e) => {
		applicationLogger.error({ reason: "Echec dans la création du seau" });
		applicationLogger.trace(e as Error);
		process.exit(1);
	})
	.finally(() => setInterval(() => applicationLogger.info("Main process is alive ..."), 3600000));
