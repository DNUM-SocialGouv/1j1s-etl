import StreamZip from "node-stream-zip";

export class StreamZipClient {
    async extract(filePath: string, fileNameInZip: string, outPath: string): Promise<void> {
        const zip = new StreamZip.async({ file: filePath });
        await zip.extract(fileNameInZip, outPath);
        await zip.close();
    }
}
