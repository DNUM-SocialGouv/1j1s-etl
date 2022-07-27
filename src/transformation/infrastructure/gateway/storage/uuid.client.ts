import crypto from "crypto";

export interface UuidClient {
	generate(): string;
}

export class NodeUuidClient implements UuidClient {
	generate(): string {
		return crypto.randomUUID();
	}
}
