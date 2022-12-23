import { Logger, LoggerFactory, LoggerStrategy, LoggerStrategyError } from "@shared/configuration/logger";
import { Configuration } from "@logements/extraction/configuration/configuration";

export class LogementsExtractionLoggerStrategy implements LoggerStrategy {
	private readonly loggers: Map<string, Logger>;

	constructor(configuration: Configuration) {
		const loggerFactory = new LoggerFactory(
			configuration.SENTRY.DSN,
			configuration.SENTRY.PROJECT,
			configuration.SENTRY.RELEASE,
			configuration.NODE_ENV,
			configuration.CONTEXT,
			configuration.LOGGER_LOG_LEVEL,
			configuration.DOMAINE
		);
		this.loggers = new Map();
		configuration.FLOWS.forEach((flow) => {
			this.loggers.set(flow, loggerFactory.create({ name: flow }));
		});
	}

	get(flowName: string): Logger {
		const logger = this.loggers.get(flowName);
		if (logger) {
			return logger;
		}
		throw new LoggerStrategyError(flowName);
	}
}
