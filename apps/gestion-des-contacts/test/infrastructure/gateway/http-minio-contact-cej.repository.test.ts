import { AxiosError, AxiosInstance } from "axios";
import { Client } from "minio";
import { PassThrough } from "stream";

import { expect, sinon, SinonFakeTimers, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { Configuration } from "@gestion-des-contacts/src/infrastructure/configuration/configuration";
import {
	HttpMinioContactCejRepository,
} from "@gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-cej.repository";
import { ContactCejFixtureBuilder } from "@gestion-des-contacts/test/fixture/contact-cej.fixture-builder";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi/strapi-http-client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

const date = new Date("2023-01-01T01:00:00.000Z");
const fileName = "230101_export_api-contact-cej.csv";
const fileNameIncludingPath = "./tmp/".concat(fileName);
const headers = [
	{ id: "dateDeCreation", title: "Date de création" },
	{ id: "nom", title: "Nom" },
	{ id: "prenom", title: "Prénom" },
	{ id: "age", title: "Âge" },
	{ id: "telephone", title: "Téléphone" },
	{ id: "email", title: "Email" },
	{ id: "ville", title: "Ville" },
	{ id: "codePostal", title: "Code postal" },
];
const contactCejs = [
	ContactCejFixtureBuilder.build(),
	ContactCejFixtureBuilder.build({ id: "2" }),
];
let clock: SinonFakeTimers;
let logger: StubbedType<Logger>;
let httpClient: StubbedType<AxiosInstance>;
let fileSystemClient: StubbedType<FileSystemClient>;
let minioClient: StubbedClass<Client>;
let configuration: StubbedType<Configuration>;
let dateService: DateService;
let strapiHttpClient: StubbedClass<StrapiHttpClient>;
let contactCejRepository: HttpMinioContactCejRepository;

describe("HttpMinioContactCejRepositoryTest", () => {
	beforeEach(() => {
		clock = sinon.useFakeTimers(date);
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		dateService = new DateService();
		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.BUCKET_NAME_EXPORT_CEJ = "bucket-name";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp";
		configuration.CONTACTS_CEJ.FILR_URL = `https://mesfichiers.some-url.net?file_name=${fileName}`;
		configuration.FILR.PASSWORD = "s0m3P4$$wOrd";
		configuration.FILR.USERNAME = "someUser";
		configuration.STRAPI.CEJ_ENDPOINT = "contact-cejs";
		httpClient = stubInterface<AxiosInstance>(sinon);
		minioClient = stubClass(Client);
		strapiHttpClient = stubClass(StrapiHttpClient);

		contactCejRepository = new HttpMinioContactCejRepository(
			strapiHttpClient,
			minioClient,
			dateService,
			fileSystemClient,
			httpClient as unknown as AxiosInstance,
			configuration,
			logger
		);
	});

	afterEach(() => {
		clock.restore();
	});

	context("Lorsque j'envoie les données contacts CEJ", () => {
		context("et que tout se passe bien", () => {
			it("copie les contacts engagement jeune", async () => {
				// When
				await contactCejRepository.envoyerLesContactsCejAPoleEmploi(contactCejs);

				// Then
				expect(fileSystemClient.writeCsv).to.have.been.calledOnceWith(fileNameIncludingPath, contactCejs, headers);
				expect(minioClient.fPutObject).to.have.been.calledOnceWith(
					configuration.MINIO.BUCKET_NAME_EXPORT_CEJ,
					fileName,
					fileNameIncludingPath,
				);
			});

			it("envoie les contacts engagement jeune à Pôle Emploi", async () => {
				// Given
				const fileContentAsBuffer = new PassThrough(Buffer.from("Some Content"));
				fileSystemClient
					.read
					.withArgs(fileNameIncludingPath)
					.resolves(fileContentAsBuffer);

				// When
				await contactCejRepository.envoyerLesContactsCejAPoleEmploi(contactCejs);

				// Then
				expect(httpClient.post).to.have.been.calledOnceWith(
					configuration.CONTACTS_CEJ.FILR_URL,
					fileContentAsBuffer, {
						auth: {
							username: configuration.FILR.USERNAME,
							password: configuration.FILR.PASSWORD,
						},
						headers: { "Content-Type": "application/octet-stream" },
						params: { file_name: fileName },
					},
				);
			});
		});

		context("et que tout se passe mal", () => {
			context("et que l'origine de l'erreur est dans le dépôt du fichier", () => {
				it("log une erreur spécifique et remonte l'erreur", async () => {
					// Given
					const axiosError = new AxiosError("Oops something went wrong!", "404");
					httpClient.post.rejects(axiosError);

					// When Then
					await expect(contactCejRepository.envoyerLesContactsCejAPoleEmploi(contactCejs)).to.be.rejectedWith(axiosError);
					expect(logger.error).to.have.been.calledOnceWith({
						msg: "L'envoi du fichier des contacts CEJ à Pôle Emploi a échoué",
						extra: { error: JSON.stringify(axiosError) },
					});
				});
			});

			it("log l'erreur qui s'est produite et remonte l'erreur", async () => {
				// Given
				const error = new Error("Oops something went wrong!");
				httpClient.post.rejects(error);

				// When Then
				await expect(contactCejRepository.envoyerLesContactsCejAPoleEmploi(contactCejs)).to.be.rejectedWith(error);
				expect(logger.error).to.have.been.calledOnceWith({
					msg: "Une erreur d'écriture est survenue avant l'envoi du fichier des contacts CEJ",
					extra: { error: JSON.stringify(error) },
				});
			});
		});
	});

	it("recupère les contacts CEJ", async () => {
		// Given
		const contactCej = ContactCejFixtureBuilder.build();
		strapiHttpClient
			.get
			.withArgs("contact-cejs", ["prenom","nom","email","telephone","age","ville","code_postal","createdAt"], "")
			.resolves([ContactCejFixtureBuilder.buildStrapi()]);

		// When
		const contactsCej = await contactCejRepository.recupererLesContactsCej();

		// Then
		expect(strapiHttpClient.get).to.have.been.calledOnceWithExactly(
			"contact-cejs",
			["prenom","nom","email","telephone","age","ville","code_postal","createdAt"],
			""
		);
		expect(contactsCej).to.have.deep.members([{ ...contactCej }]);
	});

	context("Lorsque la suppression d'un contact CEJ fonctionne correctement", () => {
		it("supprime les contacts CEJ", async () => {
			// Given
			const contactsCejs = [
				ContactCejFixtureBuilder.build({ id: "1" }),
				ContactCejFixtureBuilder.build({ id: "2" }),
				ContactCejFixtureBuilder.build({ id: "3" }),
			];

			// When
			await contactCejRepository.supprimerLesContactsEnvoyesAPoleEmploi(contactsCejs);

			// Then
			expect(strapiHttpClient.delete.callCount).to.eql(3);
		});
	});

	context("Lorsque la suppression d'un contact CEJ échoue", () => {
		it("log les contacts CEJ tombés en erreur", async () => {
			// Given
			const contactsCejs = [
				ContactCejFixtureBuilder.build({ id: "1" }),
				ContactCejFixtureBuilder.build({ id: "2" }),
				ContactCejFixtureBuilder.build({ id: "3" }),
			];

			strapiHttpClient
				.delete
				.withArgs("contact-cejs", "2")
				.rejects(new Error("Oops! Something went wrong :-("));

			// When
			await contactCejRepository.supprimerLesContactsEnvoyesAPoleEmploi(contactsCejs);

			// Then
			expect(logger.info).to.have.been.calledWith("Deletion of contact cej with id=[2] has failed");
		});
	});
});
