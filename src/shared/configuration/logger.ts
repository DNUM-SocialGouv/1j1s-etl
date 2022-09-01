import { createWriteStream } from "pino-sentry";
import internal from "stream";
import pino from "pino";

import { Environment } from "@configuration/configuration";

export type LogLevel = "debug" | "error" | "fatal" | "info" | "trace" | "warn";

export interface Logger {
	debug(...args: Array<unknown>): void;
	error(...args: Array<unknown>): void;
	fatal(...args: Array<unknown>): void;
	info(...args: Array<unknown>): void;
	trace(...args: Array<unknown>): void;
	warn(...args: Array<unknown>): void;
}

export type LoggerConfiguration = {
	logLevel: LogLevel,
	name: string,
	env: Environment
}

export class LoggerFactory {
	private static instance: LoggerFactory;
	private readonly sentryConfiguration: internal.Duplex;

	private constructor(dsn: string) {
		this.sentryConfiguration = createWriteStream({ dsn });
	}

	public static getInstance(dsn: string): LoggerFactory {
		if (this.instance) {
			return this.instance;
		}

		return new LoggerFactory(dsn);
	}

	public create(configuration: LoggerConfiguration): Logger {
		if (configuration.env === Environment.PRODUCTION) {
			return pino(configuration, this.sentryConfiguration);
		}
		return pino(configuration);
	}
}
