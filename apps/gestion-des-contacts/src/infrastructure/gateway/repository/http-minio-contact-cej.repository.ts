import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Client } from "minio";

import { ContactCej } from "@gestion-des-contacts/src/domain/model/contact-cej";
import { ContactCejRepository } from "@gestion-des-contacts/src/domain/service/contact-cej.repository";
import { Configuration } from "@gestion-des-contacts/src/infrastructure/configuration/configuration";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

export type StrapiContactCej = {
	id: string;
	prenom: string;
	nom: string;
	email: string;
	telephone: string;
	age: number;
	ville: string;
	code_postal: string;
	createdAt: string;
}

export class HttpMinioContactCejRepository implements ContactCejRepository {
	private static readonly FIELDS_TO_RETRIEVE = "prenom,nom,email,telephone,age,ville,code_postal,createdAt";
	private static readonly RELATIONS_TO_RETRIEVE = "";
	private static readonly CSV_HEADERS: Array<Record<"id" | "title", string>> = [
		{ id: "dateDeCreation", title: "Date de création" },
		{ id: "nom", title: "Nom" },
		{ id: "prenom", title: "Prénom" },
		{ id: "age", title: "Âge" },
		{ id: "telephone", title: "Téléphone" },
		{ id: "email", title: "Email" },
		{ id: "ville", title: "Ville" },
		{ id: "codePostal", title: "Code postal" },
	];

	constructor(
		private readonly strapiHttpClient: StrapiHttpClient,
		private readonly minioClient: Client,
		private readonly dateService: DateService,
		private readonly fileSystemClient: FileSystemClient,
		private readonly httpClient: AxiosInstance,
		private readonly configuration: Configuration,
		private readonly logger: Logger,
	) {
	}

	public async envoyerLesContactsCejAPoleEmploi(contactsCej: Array<ContactCej>): Promise<void> {
		const now = this.dateService.maintenant();
		const fileName = this.buildFileName(now);
		const fileNameIncludingPath = `${this.configuration.TEMPORARY_DIRECTORY_PATH}/${fileName}`;

		try {
			const contactsCejAsCsvBuffer = await this.formatToCsvBuffer(fileNameIncludingPath, contactsCej);
			await this.createBackUpOnMinio(fileName, fileNameIncludingPath);
			await this.sendToPoleEmploi(contactsCejAsCsvBuffer, fileName);
		} catch(error) {
			this.handleError(<Error>error);
		} finally {
			await this.fileSystemClient.delete(fileNameIncludingPath);
		}
	}

	public async recupererLesContactsCej(): Promise<Array<ContactCej>> {
		const { FIELDS_TO_RETRIEVE, RELATIONS_TO_RETRIEVE } = HttpMinioContactCejRepository;
		const cejEndpoint = this.configuration.STRAPI.CEJ_ENDPOINT;

		const contactsCej = await this.strapiHttpClient.get<StrapiContactCej>(cejEndpoint, FIELDS_TO_RETRIEVE, RELATIONS_TO_RETRIEVE);

		return this.toContactsCej(contactsCej);
	}

	public async supprimerLesContactsEnvoyesAPoleEmploi(contactsCej: Array<ContactCej>): Promise<void> {
		const cejEndpoint = this.configuration.STRAPI.CEJ_ENDPOINT;

		for (const contactCej of contactsCej) {
			try {
				await this.strapiHttpClient.delete(cejEndpoint, contactCej.id);
			} catch(error) {
				this.logger.info(`Deletion of contact cej with id=[${contactCej.id}] has failed`);
			}
		}
	}

	private async formatToCsvBuffer(fileNameIncludingPath: string, contactsCej: Array<ContactCej>): Promise<Buffer> {
		await this.fileSystemClient.writeCsv(fileNameIncludingPath, contactsCej, HttpMinioContactCejRepository.CSV_HEADERS);
		return await this.fileSystemClient.read(fileNameIncludingPath);
	}

	private async sendToPoleEmploi(contactsCejAsCsvBuffer: Buffer, fileName: string): Promise<void> {
		await this.httpClient.post(this.configuration.CONTACTS_CEJ.FILR_URL, contactsCejAsCsvBuffer, this.buildParams(fileName));
	}

	private async createBackUpOnMinio(fileName: string, fileNameIncludingPath: string): Promise<void> {
		await this.minioClient.fPutObject(this.configuration.MINIO.BUCKET_NAME_EXPORT_CEJ, fileName, fileNameIncludingPath);
	}

	private buildFileName(now: Date): string {
		return this.dateService.toFormat(now, "yyMMdd").concat("_export_api-contact-cej.csv");
	}

	private buildParams(fileName: string): AxiosRequestConfig {
		return {
			auth: {
				username: this.configuration.CONTACTS_CEJ.FILR_USERNAME,
				password: this.configuration.CONTACTS_CEJ.FILR_PASSWORD,
			},
			headers: { "Content-Type": "application/octet-stream" },
			params: { file_name: fileName },
		};
	}

	private handleError(error: Error): void {
		const extra = { error: JSON.stringify(error) };

		if (error instanceof AxiosError) {
			this.logger.error({ msg: "L'envoi du fichier des contacts CEJ à Pôle Emploi a échoué", extra });
		} else {
			this.logger.error({ msg: "Une erreur d'écriture est survenue avant l'envoi du fichier des contacts CEJ", extra });
		}

		throw error;
	}

	private toContactsCej(strapiContactsCej: Array<StrapiContactCej>): Array<ContactCej> {
		return strapiContactsCej.map((strapiContactCej) => this.toContactCej(strapiContactCej));
	}

	private toContactCej(strapiContactCej: StrapiContactCej): ContactCej {
		return {
			id: strapiContactCej.id,
			prenom: strapiContactCej.prenom,
			nom: strapiContactCej.nom,
			email: strapiContactCej.email,
			telephone: strapiContactCej.telephone,
			age: strapiContactCej.age,
			ville: strapiContactCej.ville,
			codePostal: strapiContactCej.code_postal,
			dateDeCreation: strapiContactCej.createdAt,
		};
	}
}
