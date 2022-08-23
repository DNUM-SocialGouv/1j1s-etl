import * as fs from "fs";
import { finished, Stream } from "stream";
import { createWriteStream } from "fs";
import { promisify } from "util";
import ReadWriteStream = NodeJS.ReadWriteStream;
import ReadableStream = NodeJS.ReadableStream;
import WritableStream = NodeJS.WritableStream;

export interface FileSystemClient {
	delete(filePathIncludingFileName: string): Promise<void>;
	read(filePathIncludingFileName: string): Promise<Buffer>;
	write(filePath: string, fileContent: string | Buffer): Promise<void>;
	writeStream(filePath: string, fileContent: Stream): Promise<void>;
}

export class NodeFileSystemClient implements FileSystemClient {
	private readonly finished: (arg1: (ReadableStream | WritableStream | ReadWriteStream)) => Promise<void>;

	constructor(private readonly temporaryDirPath: string) {
		this.finished = promisify(finished);
	}

	delete(filePathIncludingFileName: string): Promise<void> {
		fs.unlinkSync(filePathIncludingFileName);
		return Promise.resolve();
	}

	read(filePathIncludingFileName: string): Promise<Buffer> {
		return Promise.resolve(fs.readFileSync(filePathIncludingFileName));
	}

	write(filePath: string, fileContent: string | Buffer): Promise<void> {
		if (!fs.existsSync(this.temporaryDirPath)) {
			fs.mkdirSync(this.temporaryDirPath);
		}

		fs.appendFileSync(filePath, fileContent, { encoding: "utf-8" });
		return Promise.resolve();
	}

	async writeStream(filePath: string, fileContent: Stream): Promise<void> {
		const writer = createWriteStream(filePath);
		fileContent.pipe(writer);
		await this.finished(writer);
	}
}
