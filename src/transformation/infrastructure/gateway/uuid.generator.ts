import crypto from "crypto";

export interface UuidGenerator {
	generate(): string;
}

export class NodeUuidGenerator implements UuidGenerator {
	generate(): string {
		return crypto.randomUUID();
	}
}
