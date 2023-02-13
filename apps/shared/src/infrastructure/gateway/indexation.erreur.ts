export class CreateIndexError extends Error {
	constructor(public readonly reason: string, indexName: string) {
		super(`An error occured when trying to create index ${indexName}`);
	}
}

export class IndexNotFoundError extends Error {
	constructor(indexName: string) {
		super(`Error with name ${indexName} doesn't exist`);
	}
}
