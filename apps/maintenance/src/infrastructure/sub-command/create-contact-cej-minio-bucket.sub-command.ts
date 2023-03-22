import { CommandRunner, SubCommand } from "nest-commander";

import { Configuration } from "@maintenance/src/infrastructure/configuration/configuration";
import { CommandLog } from "@maintenance/src/infrastructure/configuration/log.decorator";
import {
	LifecycleRules,
	MinioAdminStorageRepository,
} from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";

@SubCommand({ name: CreateContactCejMinioBucketSubCommand.PROCESS_NAME })
export class CreateContactCejMinioBucketSubCommand extends CommandRunner {
	private static readonly PROCESS_NAME = "cej";

	constructor(
		private readonly minioAdminStorageClient: MinioAdminStorageRepository,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(CreateContactCejMinioBucketSubCommand.PROCESS_NAME)
	public override async run(): Promise<void> {
		const bucketName = this.configuration.MINIO.CONTACT_MANAGEMENT_CEJ_BUCKET_NAME;
		await this.minioAdminStorageClient.createBucket(bucketName);

		const lifecycleRules = this.createLifecycleRules(bucketName);
		await this.minioAdminStorageClient.setBucketLifecycle(bucketName, lifecycleRules);
	}

	private createLifecycleRules(bucketName: string): LifecycleRules {
		return {
			Rule: [{
				ID: bucketName,
				Status: "Enabled",
				Expiration: { Days: this.configuration.MINIO.CONTACTS_MANAGEMENT_CEJ_DAYS_AFTER_EXPIRATION },
				Filter: { Prefix: "" },
			}],
		};
	}
}
