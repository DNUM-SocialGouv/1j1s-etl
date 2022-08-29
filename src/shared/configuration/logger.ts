import pino from "pino";

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
	name: string
}

export class LoggerFactory {
	static create(configuration: LoggerConfiguration): Logger {
		return pino(configuration);
	}
}
