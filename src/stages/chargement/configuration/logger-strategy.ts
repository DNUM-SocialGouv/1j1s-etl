import { Configuration } from "@stages/chargement/configuration/configuration";
import { Logger, LoggerFactory, LoggerStrategy, LoggerStrategyError } from "@shared/configuration/logger";

export class StagesChargementLoggerStrategy implements LoggerStrategy {
	private readonly loggers: Map<string, Logger>;

	constructor(configuration: Configuration) {
		const loggerFactory = new LoggerFactory(
			configuration.SENTRY.DSN,
			configuration.SENTRY.PROJECT,
			configuration.SENTRY.RELEASE,
			configuration.NODE_ENV,
			configuration.CONTEXT,
			configuration.LOGGER_LOG_LEVEL,
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
