import { promisify } from "util";
import { unzip } from "node:zlib";

export class UnzipClient {
	public unzipGzip(contenu: string | Buffer): Promise<Buffer> {
		const doUnzip = promisify(unzip);
		return doUnzip(contenu);
	}
}