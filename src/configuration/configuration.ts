function getOrError(key: string): string {
	const environmentVariable = process.env[key];

	if (!environmentVariable) {
		throw new Error();
	}

	return environmentVariable;
}

function getOrDefault(key: string, defaultValue: string): string {
	const environmentVariable = process.env[key];
	if (!environmentVariable) {
		return defaultValue;
	}

	return environmentVariable;
}

export type Configuration = {
	MINIO_URL: string,
	MINIO_ACCESS_KEY: string,
	MINIO_SECRET_KEY: string
};

export function configure(): Configuration {
	return {
		MINIO_ACCESS_KEY: getOrError("MINIO_ACCESS_KEY"),
		MINIO_SECRET_KEY: getOrError("MINIO_SECRET_KEY"),
		MINIO_URL: getOrDefault("MINIO_URL", "http://some.url")
	};
}
