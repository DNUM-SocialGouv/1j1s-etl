import * as csvWriter from "csv-writer";
import { appendFileSync, createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync } from "fs";
import { finished, Stream } from "stream";
import { promisify } from "util";

export interface FileSystemClient {
	delete(filePathIncludingFileName: string): Promise<void>;
	read(filePathIncludingFileName: string): Promise<Buffer>;
	write(filePath: string, fileContent: string | Buffer): Promise<void>;
	writeStream(filePath: string, fileContent: Stream): Promise<void>;
	writeCsv(filePath: string, records: Array<Record<string, unknown>>, headers: Array<Record<"id" | "title", string>>): Promise<void>
}

export class NodeFileSystemClient implements FileSystemClient {
	private readonly finished: (arg1: (NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream)) => Promise<void>;
	private static readonly CSV_FIELD_DELIMITER = ";";
	private static readonly CSV_HEADER_ID_DELIMITER = ";";
	private static readonly CSV_ESCAPE_CONTENT = true;
	private static readonly CSV_ENCODING = "utf-8";

	constructor(private readonly temporaryDirPath: string) {
		this.finished = promisify(finished);
	}

	public delete(filePathIncludingFileName: string): Promise<void> {
		unlinkSync(filePathIncludingFileName);
		return Promise.resolve();
	}

	public read(filePathIncludingFileName: string): Promise<Buffer> {
		return Promise.resolve(readFileSync(filePathIncludingFileName));
	}

	public write(filePath: string, fileContent: string | Buffer): Promise<void> {
		if (!existsSync(this.temporaryDirPath)) {
			mkdirSync(this.temporaryDirPath);
		}

		appendFileSync(filePath, fileContent, { encoding: "utf-8" });
		return Promise.resolve();
	}

	public async writeStream(filePath: string, fileContent: Stream): Promise<void> {
		const writer = createWriteStream(filePath);
		fileContent.pipe(writer);
		await this.finished(writer);
	}

	public writeCsv(
		filePath: string,
		records: Array<Record<string, unknown>>,
		headers: Array<Record<"id" | "title", string>>
	): Promise<void> {
		const writer = csvWriter.createObjectCsvWriter({
			path: filePath,
			fieldDelimiter: NodeFileSystemClient.CSV_FIELD_DELIMITER,
			headerIdDelimiter: NodeFileSystemClient.CSV_HEADER_ID_DELIMITER,
			alwaysQuote: NodeFileSystemClient.CSV_ESCAPE_CONTENT,
			encoding: NodeFileSystemClient.CSV_ENCODING,
			header: headers,
		});

		return writer.writeRecords(records);
	}
}
