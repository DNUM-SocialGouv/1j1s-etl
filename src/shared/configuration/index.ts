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
