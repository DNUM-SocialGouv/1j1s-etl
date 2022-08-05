export type LogLevel = "debug" | "error" | "fatal" | "info" | "trace" | "warn";

export type CronConfiguration = {
	CRON_ENABLED: boolean
	CRON_RUN_ON_INIT: boolean
	CRON_TIME: string
	DIRECTORY_NAME: string
	FLUX_URL: string
	LOGGER_LOG_LEVEL: LogLevel
	NAME: string
	RAW_FILE_EXTENSION: string
	TRANSFORMED_FILE_EXTENSION: string
}

export type Configuration = {
	APPLICATION_LOGGER_NAME: string
	APPLICATION_LOGGER_LOG_LEVEL: LogLevel
	CRON_TIMEZONE: string
	JOBTEASER: CronConfiguration
	MINIO_ACCESS_KEY: string
	MINIO_HISTORY_DIRECTORY_NAME: string
	MINIO_PORT: number
	MINIO_RAW_BUCKET_NAME: string
	MINIO_SECRET_KEY: string
	MINIO_TRANSFORMED_BUCKET_NAME: string
	MINIO_URL: string
	TEMPORARY_DIRECTORY_PATH: string
}

export class ConfigurationFactory {
	static create(): Configuration {
		const { toBoolean, getOrError, getOrDefault } = ConfigurationFactory;
		const DEFAULT_RAW_BUCKET_NAME = "raw";
		const DEFAULT_JSON_BUCKET_NAME = "json";
		const DEFAULT_MINIO_PORT = "9000";

		return {
			APPLICATION_LOGGER_NAME: getOrDefault("APPLICATION_LOGGER_NAME", "application"),
			APPLICATION_LOGGER_LOG_LEVEL: getOrDefault("APPLICATION_LOGGER_LOG_LEVEL", "debug") as LogLevel,
			CRON_TIMEZONE: getOrError("CRON_TIMEZONE"),
			JOBTEASER: {
				CRON_ENABLED: toBoolean(getOrError("JOBTEASER_CRON_ENABLED")),
				CRON_RUN_ON_INIT: toBoolean(getOrError("JOBTEASER_CRON_RUN_ON_INIT")),
				CRON_TIME: getOrError("JOBTEASER_CRON_TIME"),
				DIRECTORY_NAME: getOrDefault("JOBTEASER_DIRECTORY_NAME", "jobteaser"),
				FLUX_URL: getOrError("JOBTEASER_FLUX_URL"),
				LOGGER_LOG_LEVEL: getOrDefault("JOBTEASER_LOGGER_LOG_LEVEL", "debug") as LogLevel,
				NAME: getOrDefault("JOBTEASER_NAME", "jobteaser"),
				RAW_FILE_EXTENSION: getOrError("JOBTEASER_RAW_FILE_EXTENSION"),
				TRANSFORMED_FILE_EXTENSION: getOrError("JOBTEASER_TRANSFORMED_FILE_EXTENSION"),
			},
			MINIO_ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
			MINIO_HISTORY_DIRECTORY_NAME: getOrDefault("MINIO_HISTORY_DIRECTORY_NAME", "history"),
			MINIO_PORT: Number(getOrDefault("MINIO_PORT", DEFAULT_MINIO_PORT)),
			MINIO_RAW_BUCKET_NAME: getOrDefault("MINIO_RAW_BUCKET_NAME", DEFAULT_RAW_BUCKET_NAME),
			MINIO_SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
			MINIO_TRANSFORMED_BUCKET_NAME: getOrDefault("MINIO_JSON_BUCKET_NAME", DEFAULT_JSON_BUCKET_NAME),
			MINIO_URL: getOrError("MINIO_URL"),
			TEMPORARY_DIRECTORY_PATH: getOrError("TEMPORARY_DIRECTORY_PATH"),
		};
	}

	static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			return defaultValue;
		}
		return environmentVariable;
	}

	static getOrError(environmentVariableKey: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
		}
		return environmentVariable;
	}

	static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}
