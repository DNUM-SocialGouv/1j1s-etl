import { AxiosInstance } from "axios";
import { Stream } from "stream";

import { FileSystemClient } from "@extraction/infrastructure/gateway/common/node-file-system.client";
import { LectureFluxErreur } from "@extraction/domain/flux.client";
import { UuidGenerator } from "@extraction/infrastructure/gateway/common/uuid.generator";

export class OctetStreamHttpClient {
    static TEMPORARY_DIR = "/tmp/";

    constructor(
        private readonly axios: AxiosInstance,
        private readonly fileSystemClient: FileSystemClient,
        private readonly uuidGenerator: UuidGenerator
    ){
    }

    async readStream(url: string): Promise<Buffer>{
        let temporaryFilePathIncludingName = "";

        try {
            temporaryFilePathIncludingName = this.generateTemporaryFilePath();
            const response = await this.axios.get<Stream>(url, { responseType: "stream" });

            await this.fileSystemClient.writeStream(
                temporaryFilePathIncludingName,
                response.data
            );

            return await this.fileSystemClient.read(temporaryFilePathIncludingName);
        } catch (e) {
            throw new LectureFluxErreur(url);
        } finally {
            await this.fileSystemClient.delete(temporaryFilePathIncludingName);
        }
    }

    private generateTemporaryFilePath(): string {
        const fileName = this.uuidGenerator.generate();
        return OctetStreamHttpClient.TEMPORARY_DIR.concat(fileName);
    }
}