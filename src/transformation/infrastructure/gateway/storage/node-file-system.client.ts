import * as fs from "fs";

export interface FileSystemClient {
	write(filePath: string, fileContent: string): Promise<void>;
	delete(filePathIncludingFileName: string): Promise<void>;
}

export class NodeFileSystemClient implements FileSystemClient {
	constructor(private readonly temporaryDirPath: string) {
	}

	write(filePath: string, fileContent: string): Promise<void> {
		if (!fs.existsSync(this.temporaryDirPath)) {
			fs.mkdirSync(this.temporaryDirPath);
		}

		fs.appendFileSync(filePath, fileContent, { encoding: "utf-8" });
		return Promise.resolve();
	}

	delete(filePathIncludingFileName: string): Promise<void> {
		fs.unlinkSync(filePathIncludingFileName);
		return Promise.resolve();
	}
}
