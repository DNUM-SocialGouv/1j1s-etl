import { Configuration } from "@configuration/configuration";
import { Logger } from "@shared/configuration/logger";
import { MinioAdminStorageRepository } from "@shared/gateway/minio-admin-storage.repository";

export class Setup {
	static BUCKET_CREATION_FAILURE_MESSAGE = "Echec dans la création des seaux";
	static BUCKET_CREATION_SUCCEEDED_MESSAGE = "Les seaux ont été correctement créés";
	static IS_ALIVE_MESSAGE = "Main process is alive ...";

	constructor(
		private readonly configuration: Configuration,
		private readonly logger: Logger,
		private readonly adminStorageClient: MinioAdminStorageRepository,
	) {
	}

	async init(): Promise<void> {
		try {
			await this.adminStorageClient.createBucket(this.configuration.MINIO_RAW_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO_TRANSFORMED_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO_RESULT_BUCKET_NAME);
			this.logger.info(Setup.BUCKET_CREATION_SUCCEEDED_MESSAGE);
		} catch (e) {
			this.logger.error({ reason: Setup.BUCKET_CREATION_FAILURE_MESSAGE });
			this.logger.trace(e as Error);
		} finally {
			setInterval(() => this.logger.info(Setup.IS_ALIVE_MESSAGE), 3600000);
		}
	}
}
