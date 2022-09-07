import { createWriteStream, PinoSentryOptions, Severity } from "pino-sentry";
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

export type LoggerConfiguration = { name: string }

export class LoggerStrategyError extends Error {
	constructor(flowName: string) {
		super(`No logger available for flow ${flowName}`);
	}
}

export class LoggerFactory {
	private sentryConfiguration: PinoSentryOptions;
	private readonly sentryDsn: string;
	private readonly project: string;
	private readonly release: string;
	private readonly environment: Environment;
	private readonly context: string;
	private readonly logLevel: LogLevel;
	private readonly now: string;

	constructor(
		sentryDsn: string,
		project: string,
		release: string,
		environment: Environment,
		context: string,
		logLevel: LogLevel
	) {
		this.now = new Date().toISOString().split("T")[0];
		this.sentryDsn = sentryDsn;
		this.sentryConfiguration = {
			dsn: sentryDsn,
			release: project.concat("@").concat(release),
			level: Severity.Info,
			sentryExceptionLevels: [
				Severity.Critical,
				Severity.Error,
				Severity.Fatal,
			],
		};

		this.project = project;
		this.release = release;
		this.environment = environment;
		this.context = context;
		this.logLevel = logLevel;
	}

	public create(configuration: LoggerConfiguration): Logger {
		if (this.environment === Environment.PRODUCTION) {
			const pinoSentryStream = createWriteStream({
				...this.sentryConfiguration,
				decorateScope: ((data: unknown, scope: { setTags: (tags: Record<string, string>) => void }): void => {
					scope.setTags({ context: this.context, date: this.now, flow: configuration.name });
				}),
			});
			return pino({ ...configuration, level: this.logLevel }, pinoSentryStream);
		}
		return pino({ ...configuration, level: this.logLevel });
	}
}
