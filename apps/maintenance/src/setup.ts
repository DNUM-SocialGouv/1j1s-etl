import {
	LifecycleRule,
	LifecycleRules,
	MinioAdminStorageRepository,
} from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";

import { Configuration } from "@shared/src/infrastructure/configuration/configuration";
import { Logger } from "@shared/src/infrastructure/configuration/logger";

export class Setup {
	private static BUCKET_CREATION_FAILURE_MESSAGE = "Echec dans la création des seaux";
	private static BUCKET_CREATION_SUCCEEDED_MESSAGE = "Les seaux ont été correctement créés";
	private static BUCKET_CREATION_STARTED_MESSAGE = "Début de la création des seaux...";
	private static BUCKET_LIFECYCLE_RULES_CREATION_STARTED_MESSAGE = "Début de la création des règles de cycle de vie sur les buckets...";
	private static BUCKET_LIFECYCLE_RULES_CREATION_SUCCEEDED_MESSAGE = "Les règles de cycle de vie sur les buckets ont été correctement créées";
	private static IS_ALIVE_MESSAGE = "Main process is alive ...";

	private flows: Array<string>;

	constructor(
		private readonly configuration: Configuration,
		private readonly logger: Logger,
		private readonly adminStorageClient: MinioAdminStorageRepository,
	) {
		this.flows = [
			...this.configuration.EVENTS.FLOWS,
			...this.configuration.HOUSING.FLOWS,
			...this.configuration.INTERNSHIPS.FLOWS,
		];
	}

	public async init(): Promise<void> {
		try {
			this.logger.info(Setup.BUCKET_CREATION_STARTED_MESSAGE);

			await this.adminStorageClient.createBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_RAW_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_RESULT_BUCKET_NAME);

			await this.adminStorageClient.createBucket(this.configuration.MINIO.EVENTS_MINIO_RAW_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.EVENTS_MINIO_TRANSFORMED_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.EVENTS_MINIO_RESULT_BUCKET_NAME);

			await this.adminStorageClient.createBucket(this.configuration.MINIO.HOUSING_MINIO_RAW_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.HOUSING_MINIO_TRANSFORMED_BUCKET_NAME);
			await this.adminStorageClient.createBucket(this.configuration.MINIO.HOUSING_MINIO_RESULT_BUCKET_NAME);

			this.logger.info(Setup.BUCKET_CREATION_SUCCEEDED_MESSAGE);
			this.logger.info(Setup.BUCKET_LIFECYCLE_RULES_CREATION_STARTED_MESSAGE);

			const rulesToCreateOnExtractionBucket = this.createRules();
			const rulesToCreateOnTransformationBucket = this.createRules(true);
			const rulesToCreateOnLoadingBucket = this.createRules();

			await this.createRulesOnBucket(rulesToCreateOnExtractionBucket, rulesToCreateOnTransformationBucket, rulesToCreateOnLoadingBucket);

			const internshipsExistingRulesOnExtractionBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_RAW_BUCKET_NAME);
			const internshipsExistingRulesOnTransformationBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME);
			const internshipsExistingRulesOnLoadingBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.INTERNSHIPS_MINIO_RESULT_BUCKET_NAME);

			const eventsExistingRulesOnExtractionBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.EVENTS_MINIO_RAW_BUCKET_NAME);
			const eventsExistingRulesOnTransformationBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.EVENTS_MINIO_TRANSFORMED_BUCKET_NAME);
			const eventsExistingRulesOnLoadingBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.EVENTS_MINIO_RESULT_BUCKET_NAME);

			const housingExistingRulesOnExtractionBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.HOUSING_MINIO_RAW_BUCKET_NAME);
			const housingExistingRulesOnTransformationBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.HOUSING_MINIO_TRANSFORMED_BUCKET_NAME);
			const housingExistingRulesOnLoadingBucket = await this.adminStorageClient.getRulesOnBucket(this.configuration.MINIO.HOUSING_MINIO_RESULT_BUCKET_NAME);

			this.logger.info(Setup.BUCKET_LIFECYCLE_RULES_CREATION_SUCCEEDED_MESSAGE);
			this.logger.info({
				summary: {
					rulesToCreate: [rulesToCreateOnExtractionBucket, rulesToCreateOnTransformationBucket, rulesToCreateOnLoadingBucket],
					existingRules: [
						internshipsExistingRulesOnExtractionBucket,
						internshipsExistingRulesOnTransformationBucket,
						internshipsExistingRulesOnLoadingBucket,
						eventsExistingRulesOnExtractionBucket,
						eventsExistingRulesOnTransformationBucket,
						eventsExistingRulesOnLoadingBucket,
						housingExistingRulesOnExtractionBucket,
						housingExistingRulesOnTransformationBucket,
						housingExistingRulesOnLoadingBucket,
					],
				},
			});
		} catch (e) {
			this.logger.error({
				msg: (<Error> e).message,
				extra: {
					reason: Setup.BUCKET_CREATION_FAILURE_MESSAGE,
					stackTrace: (<Error> e).stack,
				},
			});
		} finally {
			setInterval(() => this.logger.info(Setup.IS_ALIVE_MESSAGE), 3600000);
		}
	}

	private async createRulesOnBucket(
		rulesToCreateOnExtractionBucket: LifecycleRules,
		rulesToCreateOnTransformationBucket: LifecycleRules,
		rulesToCreateOnLoadingBucket: LifecycleRules
	): Promise<void> {
		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.INTERNSHIPS_MINIO_RAW_BUCKET_NAME,
			rulesToCreateOnExtractionBucket
		);
		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.EVENTS_MINIO_RAW_BUCKET_NAME,
			rulesToCreateOnExtractionBucket
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.HOUSING_MINIO_RAW_BUCKET_NAME,
			rulesToCreateOnExtractionBucket
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.INTERNSHIPS_MINIO_TRANSFORMED_BUCKET_NAME,
			rulesToCreateOnTransformationBucket,
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.EVENTS_MINIO_TRANSFORMED_BUCKET_NAME,
			rulesToCreateOnTransformationBucket,
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.HOUSING_MINIO_TRANSFORMED_BUCKET_NAME,
			rulesToCreateOnExtractionBucket
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.EVENTS_MINIO_RESULT_BUCKET_NAME,
			rulesToCreateOnLoadingBucket,
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.INTERNSHIPS_MINIO_RESULT_BUCKET_NAME,
			rulesToCreateOnLoadingBucket,
		);

		await this.adminStorageClient.setBucketLifecycle(
			this.configuration.MINIO.HOUSING_MINIO_RESULT_BUCKET_NAME,
			rulesToCreateOnExtractionBucket
		);
	}

	private createRules(isInsideDirectory = false): LifecycleRules {
		const rules: Array<LifecycleRule> = [];

		for (const flow of this.flows) {
			rules.push({
				Expiration: {
					Days: this.configuration.MINIO.DAYS_AFTER_EXPIRATION,
				},
				Filter: {
					Prefix: isInsideDirectory ? `${flow}/${this.configuration.MINIO.HISTORY_DIRECTORY_NAME}` : `${flow}`,
				},
				Status: this.configuration.MINIO.LIFECYCLE_RULES_STATUS,
				ID: isInsideDirectory ? `${flow}-${this.configuration.MINIO.HISTORY_DIRECTORY_NAME}` : `${flow}`,
			});
		}

		return { Rule: rules };
	}
}
