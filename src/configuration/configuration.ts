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

export function configure(): Configuration {
	return {
		APPLICATION_ADDRESS: getOrDefault("APPLICATION_ADDRESS", '127.0.0.1'),
		APPLICATION_PORT: Number(getOrError("APPLICATION_PORT"))
	}
}

export type Configuration = {
	APPLICATION_ADDRESS: string;
	APPLICATION_PORT: number;
}
