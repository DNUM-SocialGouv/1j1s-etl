import { LifecycleRule } from "minio";
import { Command, CommandRunner, Option } from "nest-commander";

import { CommandLog } from "@maintenance/src/infrastructure/configuration/log.decorator";
import {
	MinioAdminStorageRepository,
} from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";

type Options = {
	bucketName: string;
	expiration: number;
};

@Command({ name: CreateMinioBucketCommand.PROCESS_NAME })
export class CreateMinioBucketCommand extends CommandRunner {
	private static PROCESS_NAME = "mkbucket";

	constructor(private readonly minioAdminStorageClient: MinioAdminStorageRepository) {
		super();
	}

	@CommandLog(CreateMinioBucketCommand.PROCESS_NAME)
	public override async run(passedParams: string[], options?: Options): Promise<void> {
		const bucketName = options.bucketName;
		const daysAfterExpiration = options.expiration;

		const lifecycleRule = this.createLifecycleRule(bucketName, daysAfterExpiration);

		await this.minioAdminStorageClient.createBucket(bucketName);
		await this.minioAdminStorageClient.setBucketLifecycle(bucketName, { Rule: [lifecycleRule] });
	}

	@Option({
		flags: "-b, --bucket-name <bucket-name>",
		description: "Name of the bucket you want to create and configure",
		required: true,
	})
	private parseBucketName(value: string): string {
		return value;
	}

	@Option({
		flags: "-e, --expiration <number of days>",
		description: "Number of days after which files inside the bucket are removed\n" +
		"If the value is less than 0, then it'll be returned as positive value",
		required: false,
		defaultValue: Number(process.env["MINIO_DAYS_AFTER_EXPIRATION"]),
	})
	private parseExpiration(value: string): number {
		return Math.abs(Number(value));
	}

	private createLifecycleRule(bucketName: string, daysAfterExpiration: number): LifecycleRule {
		return {
			ID: bucketName,
			Status: "Enabled",
			Expiration: { Days: daysAfterExpiration },
			RuleFilter: { Prefix: "" },
		};
	}
}
