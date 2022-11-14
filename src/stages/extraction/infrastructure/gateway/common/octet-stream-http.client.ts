import { AxiosInstance } from "axios";
import { Stream } from "stream";

import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { LectureFluxErreur } from "@stages/extraction/domain/flux.repository";
import { UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";

export class OctetStreamHttpClient {
    constructor(
        private readonly axios: AxiosInstance,
        private readonly fileSystemClient: FileSystemClient,
        private readonly uuidGenerator: UuidGenerator,
        private readonly temporaryFilePath: string
    ){
    }

    public async readStream(url: string): Promise<Buffer>{
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
        return this.temporaryFilePath.concat(fileName);
    }
}
