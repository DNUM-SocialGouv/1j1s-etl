import crypto from "crypto";

export interface UuidGenerator {
	generate(): string;
}

export class NodeUuidGenerator implements UuidGenerator {
	public generate(): string {
		return crypto.randomUUID();
	}
}
