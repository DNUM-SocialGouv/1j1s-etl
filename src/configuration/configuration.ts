function getOrError(key: string): string {
	if (!process.env[key]) {
		throw new Error();
	}

	return process.env[key]!;
}

function getOrDefault(key: string, defaultValue: string): string {
	if (!process.env[key]) {
		return defaultValue;
	}

	return process.env[key]!;
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
		MINIO_URL: getOrError("MINIO_URL")
	};
}
