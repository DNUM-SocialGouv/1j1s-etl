import * as fs from "fs";

export interface FileSystemClient {
	delete(filePathIncludingFileName: string): Promise<void>;
	read(filePathIncludingFileName: string): Promise<string>;
	write(filePath: string, fileContent: string): Promise<void>;
}

export class NodeFileSystemClient implements FileSystemClient {
	private readonly encoding = "utf-8";

	constructor(private readonly temporaryDirPath: string) {
	}

	public delete(filePathIncludingFileName: string): Promise<void> {
		fs.unlinkSync(filePathIncludingFileName);
		return Promise.resolve();
	}

	public read(filePathIncludingFileName: string): Promise<string> {
		const fileContent = fs.readFileSync(filePathIncludingFileName, this.encoding);
		return Promise.resolve(fileContent);
	}

	public write(filePath: string, fileContent: string): Promise<void> {
		if (!fs.existsSync(this.temporaryDirPath)) {
			fs.mkdirSync(this.temporaryDirPath);
		}

		fs.appendFileSync(filePath, fileContent, { encoding: this.encoding });
		return Promise.resolve();
	}
}
