import { Client } from "minio";

import { UnJeune1Solution } from "@logements/src/chargement/domain/model/1jeune1solution";
import { Configuration } from "@logements/src/chargement/infrastructure/configuration/configuration";

import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export interface StorageClient {
	ecrire: (cheminDuFichierDistant: string, annonces: string, nomDuFlux: string) => Promise<void>,
	lire: (cheminDuFichierDistant: string, nomDuFlux: string) => Promise<Array<UnJeune1Solution.AttributsAnnonceDeLogement>>,
}

export class MinioStorageClient implements StorageClient {
	constructor(
		private readonly configuration: Configuration,
		private readonly fileSystemClient: FileSystemClient,
		private readonly minioClient: Client,
        private readonly uuidClient: UuidGenerator,
	) {
	}

	public async ecrire(filepath: string, fileContent: string, flowName: string): Promise<void> {
        const nameFile = this.uuidClient.generate();
        const localfilePath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile);

        try {
            await this.fileSystemClient.write(localfilePath, fileContent);
            await this.minioClient.fPutObject(
                this.configuration.MINIO.RESULT_BUCKET_NAME,
                filepath,
                localfilePath,
            );
        } catch(error) {
            throw new EcritureFluxErreur(flowName);
        } finally {
            await this.fileSystemClient.delete(localfilePath);
        }
	}

	public async lire(filePath: string, flowName: string): Promise<Array<UnJeune1Solution.AttributsAnnonceDeLogement>> {
        const nameFile = this.uuidClient.generate();
        const localfilePath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile);

        try {
            await this.minioClient.fGetObject(
                this.configuration.MINIO.TRANSFORMED_BUCKET_NAME,
                filePath,
                localfilePath
            );
            const fileContent = await this.fileSystemClient.read(localfilePath);
            return (<Array<UnJeune1Solution.AttributsAnnonceDeLogement>>JSON.parse(fileContent.toString()));
        } catch (error) {
            throw new LectureFluxErreur(flowName);
        } finally {
            await this.fileSystemClient.delete(localfilePath);
        }

	}
}

export class EcritureFluxErreur extends Error {
    constructor(flowName: string){
        super("An error occurred while writing the flow : ".concat(flowName));
    }
}

export class LectureFluxErreur extends Error {
    constructor(flowName: string){
        super("An error occurred while reading the flow : ".concat(flowName));
    }
}
