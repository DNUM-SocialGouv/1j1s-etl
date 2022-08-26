import pino from "pino";

import { Logger } from "@shared/configuration/logger";
import { LogLevel } from "@shared/configuration/log-level";

export type LoggerConfiguration = {
	logLevel: LogLevel,
	name: string
}

export class LoggerFactory {
	static create(configuration: LoggerConfiguration): Logger {
		return pino(configuration);
	}
}
