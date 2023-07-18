import { unzip } from "node:zlib";

import { promisify } from "util";

export class UnzipClient {
	public unzipGzip(contenu: string | Buffer): Promise<Buffer> {
		const doUnzip = promisify(unzip);
		const result = doUnzip(contenu);
		return result;
	}
}
