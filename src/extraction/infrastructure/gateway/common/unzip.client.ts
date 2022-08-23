import { unzip } from "node:zlib";
import { promisify } from "util";

export class UnzipClient {
	unzipGzip(contenu: string | Buffer): Promise<Buffer> {
		const doUnzip = promisify(unzip);
		return doUnzip(contenu);
	}
}
