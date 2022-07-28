import * as fs from "fs";

export interface FileSystemClient {
	delete(filePathIncludingFileName: string): Promise<void>;
	read(filePathIncludingFileName: string): Promise<string>;
	write(filePath: string, fileContent: string): Promise<void>;
}

export class NodeFileSystemClient implements FileSystemClient {
	constructor(private readonly temporaryDirPath: string) {
	}

	delete(filePathIncludingFileName: string): Promise<void> {
		fs.unlinkSync(filePathIncludingFileName);
		return Promise.resolve();
	}

	read(filePathIncludingFileName: string): Promise<string> {
		const fileContent = fs.readFileSync(filePathIncludingFileName, "utf-8");
		return Promise.resolve(fileContent);
	}

	write(filePath: string, fileContent: string): Promise<void> {
		if (!fs.existsSync(this.temporaryDirPath)) {
			fs.mkdirSync(this.temporaryDirPath);
		}

		fs.appendFileSync(filePath, fileContent, { encoding: "utf-8" });
		return Promise.resolve();
	}
}
