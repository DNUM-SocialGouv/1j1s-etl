import { Configuration } from "@logements/src/transformation/infrastructure/configuration/configuration";

import {
	Logger,
	LoggerFactory,
	LoggerStrategy,
	LoggerStrategyError,
} from "@shared/src/infrastructure/configuration/logger";

export class LogementsTransformationLoggerStrategy implements LoggerStrategy {
	private readonly loggers: Map<string, Logger>;

	constructor(configuration: Configuration) {
		const loggerFactory = new LoggerFactory(
			configuration.SENTRY.DSN,
			configuration.SENTRY.PROJECT,
			configuration.SENTRY.RELEASE,
			configuration.NODE_ENV,
			configuration.CONTEXT,
			configuration.LOGGER_LOG_LEVEL,
			configuration.DOMAINE,
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
