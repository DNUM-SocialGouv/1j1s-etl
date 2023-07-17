import { unzip } from "node:zlib";

import { promisify } from "util";

export class UnzipClient {
	public unzipGzip(contenu: string | Buffer): Promise<Buffer> {
		console.log("contenu", contenu);
		const doUnzip = promisify(unzip);
		console.log("doUnzip", doUnzip);
		const result = doUnzip(contenu);
		console.log("result", result);
		return result;
	}
}
