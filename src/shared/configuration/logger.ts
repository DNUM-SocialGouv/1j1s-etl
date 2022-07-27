export interface Logger {
	debug(...args: Array<unknown>): void;
	error(...args: Array<unknown>): void;
	fatal(...args: Array<unknown>): void;
	info(...args: Array<unknown>): void;
	trace(...args: Array<unknown>): void;
	warn(...args: Array<unknown>): void;
}
