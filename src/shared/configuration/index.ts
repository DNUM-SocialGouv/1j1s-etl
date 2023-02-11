export enum Environment {
	DEVELOPMENT = "development",
	PRODUCTION = "production",
	QUALIFICATION = "qualification"
}

export type SentryConfiguration = {
	DSN: string
	PROJECT: string
	RELEASE: string
}

export class Validator {
	protected static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			return defaultValue;
		}
		return environmentVariable;
	}

	protected static getOrError(environmentVariableKey: string): string {
		const environmentVariable = process.env[environmentVariableKey];
		if (!environmentVariable) {
			throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
		}
		return environmentVariable;
	}

	protected static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}
