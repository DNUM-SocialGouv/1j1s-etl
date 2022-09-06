import { Configuration } from "@chargement/configuration/configuration";
import { Logger, LoggerFactory } from "@shared/configuration/logger";

export class LoggerStrategy {
	private readonly loggers: Map<string, Logger>;

	constructor(configuration: Configuration) {
		const loggerFactory = LoggerFactory.getInstance(
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
		throw new Error("");
	}
}
