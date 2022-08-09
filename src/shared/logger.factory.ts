import pino from "pino";

import { Configuration, CronConfiguration } from "@configuration/configuration";
import { Logger } from "@shared/configuration/logger";

export class LoggerFactory {
	static create(configuration: Configuration | CronConfiguration): Logger {
		if (LoggerFactory.isConfiguration(configuration)) {
			return pino({
				level: configuration.APPLICATION_LOGGER_LOG_LEVEL,
				name: configuration.APPLICATION_LOGGER_NAME,
			});
		} else {
			return pino({
				level: configuration.LOGGER_LOG_LEVEL,
				name: configuration.NAME,
			});
		}
	}

	private static isConfiguration(object: unknown): object is Configuration {
		return Boolean(LoggerFactory.isObject(object) && object["APPLICATION_LOGGER_NAME"]);
	}

	private static isObject(value: unknown): value is { [key: string]: string } {
		return typeof value === "object";
	}
}
