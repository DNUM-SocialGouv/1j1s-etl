import { Configuration } from "@chargement/configuration/configuration";
import { Logger, LoggerFactory } from "@shared/configuration/logger";

export class LoggerStrategy {
	private loggers: Map<string, Logger>;

	constructor(configuration: Configuration) {
		const loggerFactory = LoggerFactory.getInstance(
			configuration.SENTRY.DSN,
			configuration.SENTRY.PROJECT,
			configuration.RELEASE,
			configuration.NODE_ENV,
			"chargement",
		);
		this.loggers = new Map([
			[
				configuration.JOBTEASER.NAME,
				loggerFactory.create({
					name: configuration.JOBTEASER.NAME,
					logLevel: configuration.LOGGER_LOG_LEVEL,
				}),
			],
			[
				configuration.STAGEFR_COMPRESSED.NAME,
				loggerFactory.create({
					name: configuration.STAGEFR_COMPRESSED.NAME,
					logLevel: configuration.LOGGER_LOG_LEVEL,
				}),
			],
			[
				configuration.STAGEFR_UNCOMPRESSED.NAME,
				loggerFactory.create({
					name: configuration.STAGEFR_UNCOMPRESSED.NAME,
					logLevel: configuration.LOGGER_LOG_LEVEL,
				}),
			],
		]);
	}

	get(flowName: string): Logger {
		const logger = this.loggers.get(flowName);
		if (logger) {
			return logger;
		}
		throw new Error("");
	}
}
