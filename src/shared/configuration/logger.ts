import { createWriteStream, Sentry, Severity } from "pino-sentry";
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
	logLevel: LogLevel
	name: string,
}

export class LoggerStrategy {
	private loggers: Map<string, Logger>;

	constructor(
		jobteaserLogger: Logger,
		stagefrCompressedLogger: Logger,
		stagefrUncompressedLogger: Logger,
	) {
		this.loggers = new Map([
			["jobteaser", jobteaserLogger],
			["stagefr-compresse", stagefrCompressedLogger],
			["stagefr-decompresse", stagefrUncompressedLogger],
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

export class LoggerFactory {
	private static instance: LoggerFactory;
	private readonly sentryConfiguration: internal.Duplex;
	private readonly sentryDsn: string;
	private readonly project: string;
	private readonly release: string;
	private readonly environment: Environment;

	private constructor(
		sentryDsn: string,
		project: string,
		release: string,
		environment: Environment,
		context: string,
	) {
		const now = new Date().toISOString().split("T")[0];
		this.sentryDsn = sentryDsn;
		this.sentryConfiguration = createWriteStream({
			dsn: sentryDsn,
			release: project.concat("@").concat(release),
			level: Severity.Info,
			sentryExceptionLevels: [
				Severity.Critical,
				Severity.Error,
				Severity.Fatal,
			],
			decorateScope: ((data, scope) => {
				scope.setTags({ context, date: now });
			}),
		});

		this.project = project;
		this.release = release;
		this.environment = environment;
	}

	public static getInstance(
		sentryDsn: string,
		project: string,
		release: string,
		environment: Environment,
		context: string,
	): LoggerFactory {
		if (this.instance) {
			return this.instance;
		}

		return new LoggerFactory(
			sentryDsn,
			project,
			release,
			environment,
			context,
		);
	}

	public create(configuration: LoggerConfiguration): Logger {
		if (this.environment === Environment.PRODUCTION) {
			Sentry.setTag("flow", configuration.name);
			return pino(configuration, this.sentryConfiguration);
		}
		return pino(configuration);
	}
}
