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
        const entriesNames = Object.keys(entries);

        if (entriesNames.length > 1) {
            throw new Error("Multiple files inside the zip");
        }
        const onlyEntryInZip = entries[entriesNames[0]];

        return await zip.entryData(onlyEntryInZip);
    }
}
