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
			configuration.LOGGER_LOG_LEVEL,
		);
		this.loggers = new Map([
			[configuration.JOBTEASER.NAME, loggerFactory.create({ name: configuration.JOBTEASER.NAME })],
			[configuration.STAGEFR_COMPRESSED.NAME, loggerFactory.create({ name: configuration.STAGEFR_COMPRESSED.NAME })],
			[configuration.STAGEFR_UNCOMPRESSED.NAME, loggerFactory.create({ name: configuration.STAGEFR_UNCOMPRESSED.NAME })],
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
