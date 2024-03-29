import pino from "pino";
import { createWriteStream, PinoSentryOptions, Severity } from "pino-sentry";

import { Environment } from "@shared/src/infrastructure/configuration/configuration";

export type LogLevel = "debug" | "error" | "fatal" | "info" | "trace" | "warn";

export type LoggerConfiguration = { name: string }

export type Domaine = "Global" | "Logements" | "Stages" | "Évènements" | "Maintenance" | "Gestion des Contacts" | "Formations initiales";

export interface Logger {
	debug(...args: Array<unknown>): void;
	error(...args: Array<unknown>): void;
	fatal(...args: Array<unknown>): void;
	info(...args: Array<unknown>): void;
	trace(...args: Array<unknown>): void;
	warn(...args: Array<unknown>): void;
}

export interface LoggerStrategy {
	get(flowName: string): Logger;
}

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
	private readonly domaine: Domaine;

	constructor(
		sentryDsn: string,
		project: string,
		release: string,
		environment: Environment,
		context: string,
		logLevel: LogLevel,
		domaine: Domaine,
	) {
		this.now = new Date().toISOString().split("T")[0];
		this.sentryDsn = sentryDsn;
		this.sentryConfiguration = {
			dsn: sentryDsn,
			release: project.concat("@").concat(release),
			level: Severity.Error,
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
		this.domaine = domaine;
	}

	public create(configuration: LoggerConfiguration): Logger {
		if (this.environment !== Environment.DEVELOPMENT && this.environment !== Environment.TEST) {
			const pinoSentryStream = createWriteStream({
				...this.sentryConfiguration,
				decorateScope: ((data: unknown, scope: { setTags: (tags: Record<string, string>) => void }): void => {
					scope.setTags({ domaine: this.domaine, context: this.context, date: this.now, flow: configuration.name });
				}),
			});
			return pino({ ...configuration, level: this.logLevel }, pino.multistream([pinoSentryStream, { stream: process.stdout }]));
		}
		return pino({ ...configuration, level: this.logLevel });
	}
}
