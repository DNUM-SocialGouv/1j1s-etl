import { Configuration } from "@configuration/configuration";
import {
	LifecycleRule,
	LifecycleRules,
	MinioAdminStorageRepository
} from "@shared/gateway/minio-admin-storage.repository";
import { Logger } from "@shared/configuration/logger";

export class Setup {
	private static BUCKET_CREATION_FAILURE_MESSAGE = "Echec dans la création des seaux";
	private static BUCKET_CREATION_SUCCEEDED_MESSAGE = "Les seaux ont été correctement créés";
	private static BUCKET_CREATION_STARTED_MESSAGE = "Début de la création des seaux...";
	private static BUCKET_LIFECYCLE_RULES_CREATION_STARTED_MESSAGE = "Début de la création des règles de cycle de vie sur les buckets...";
	private static BUCKET_LIFECYCLE_RULES_CREATION_SUCCEEDED_MESSAGE = "Les règles de cycle de vie sur les buckets ont été correctement créées";
	private static IS_ALIVE_MESSAGE = "Main process is alive ...";

	constructor(
		private readonly configuration: Configuration,
		private readonly logger: Logger,
		private readonly adminStorageClient: MinioAdminStorageRepository,
	) {
	}

	async init(): Promise<void> {
		try {
			this.logger.info(Setup.BUCKET_CREATION_STARTED_MESSAGE);

			await this.adminStorageClient.createBucket(this.configuration.MINIO_RAW_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO_TRANSFORMED_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO_RESULT_BUCKET_NAME);

			this.logger.info(Setup.BUCKET_CREATION_SUCCEEDED_MESSAGE);
			this.logger.info(Setup.BUCKET_LIFECYCLE_RULES_CREATION_STARTED_MESSAGE);

			const flows = [
				this.configuration.JOBTEASER.NAME,
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
			];

			const rulesToCreateOnTransformationBucket = this.createRules(flows, true);
			const rulesToCreateOnLoadingBucket = this.createRules(flows);

			await this.adminStorageClient.setBucketLifecycle(
				this.configuration.MINIO_TRANSFORMED_BUCKET_NAME,
				rulesToCreateOnTransformationBucket,
			);

			await this.adminStorageClient.setBucketLifecycle(
				this.configuration.MINIO_RESULT_BUCKET_NAME,
				rulesToCreateOnLoadingBucket,
			);

			const existingRulesOnTransformationBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO_TRANSFORMED_BUCKET_NAME);
			const existingRulesOnLoadingBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO_RESULT_BUCKET_NAME);

			this.logger.info(Setup.BUCKET_LIFECYCLE_RULES_CREATION_SUCCEEDED_MESSAGE);
			this.logger.info({
				summary: {
					rulesToCreate: [rulesToCreateOnTransformationBucket, rulesToCreateOnLoadingBucket],
					existingRules: [existingRulesOnTransformationBucket, existingRulesOnLoadingBucket]
				}
			});
		} catch (e) {
			this.logger.error({ reason: Setup.BUCKET_CREATION_FAILURE_MESSAGE });
			this.logger.trace(e as Error);
		} finally {
			setInterval(() => this.logger.info(Setup.IS_ALIVE_MESSAGE), 3600000);
		}
	}

	private createRules(flows: Array<string>, isInsideDirectory: boolean = false): LifecycleRules {
		const rules: Array<LifecycleRule> = [];

		for (const flow of flows) {
			rules.push({
				Expiration: {
					Days: this.configuration.MINIO_DAYS_AFTER_EXPIRATION,
				},
				Filter: {
					Prefix: isInsideDirectory ? `/${flow}/${this.configuration.MINIO_HISTORY_DIRECTORY_NAME}` : `/${flow}`,
				},
				Status: this.configuration.MINIO_LIFECYCLE_RULES_STATUS,
				ID: isInsideDirectory ? `${flow}-${this.configuration.MINIO_HISTORY_DIRECTORY_NAME}` : `${flow}`,
			});
		}

		return { Rule: rules };
	}
}
