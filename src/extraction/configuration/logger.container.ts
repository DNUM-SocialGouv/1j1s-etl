import { Configuration } from "@extraction/configuration/configuration";
import { Logger, LoggerFactory } from "@shared/configuration/logger";

export type LoggerContainer = {
	jobteaser: Logger
	"stagefr-compressed": Logger
	"stagefr-uncompressed": Logger
}

export class LoggerContainerFactory {
	private static context = "extraction";

	public static create(configuration: Configuration): LoggerContainer {
		const loggerFactory = LoggerFactory.getInstance(
			configuration.SENTRY.DSN,
			configuration.SENTRY.PROJECT,
			configuration.RELEASE,
			configuration.NODE_ENV,
			this.context,
		);

		return {
			jobteaser: loggerFactory.create({
				name: configuration.JOBTEASER.NAME,
				logLevel: configuration.LOGGER_LOG_LEVEL,
			}),
			"stagefr-compressed": loggerFactory.create({
				name: configuration.STAGEFR_COMPRESSED.NAME,
				logLevel: configuration.LOGGER_LOG_LEVEL,
			}),
			"stagefr-uncompressed": loggerFactory.create({
				name: configuration.STAGEFR_UNCOMPRESSED.NAME,
				logLevel: configuration.LOGGER_LOG_LEVEL,
			}),
		};
	}
}
