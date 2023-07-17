import * as Buffer from "buffer";
import StreamZip from "node-stream-zip";

export class StreamZipClient {
    async extract(filePath: string, fileNameInZip: string, outPath: string): Promise<void> {
        const zip = new StreamZip.async({ file: filePath });
        await zip.extract(fileNameInZip, outPath);
        await zip.close();
    }

    async extractOnlyFileWithUnknowName(filePath: string): Promise<string | Buffer> {
        const zip = new StreamZip.async({ file: filePath });
        const entries = await zip.entries();

        if (Object.keys(entries).length > 1) {
            throw new Error("Multiple files inside the zip");
        }

        const data = await zip.entryData(entries[Object.keys(entries)[0]]);
        await zip.close();

        return data;
    }
}
