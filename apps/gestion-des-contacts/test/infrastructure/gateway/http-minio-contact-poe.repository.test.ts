import { AxiosError, AxiosInstance } from "axios";
import { Client } from "minio";
import { PassThrough } from "stream";

import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { Configuration } from "@gestion-des-contacts/src/infrastructure/configuration/configuration";
import {
	HttpMinioContactPoeRepository,
} from "@gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-poe.repository";
import { ContactPoeFixtureBuilder } from "@gestion-des-contacts/test/fixture/contact-poe.fixture-builder";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

const date = new Date("2023-01-01T01:00:00.000Z");
const fileName = "230101_export_api-contact-poe.csv";
const fileNameIncludingPath = "./tmp/".concat(fileName);
const headers = [
	{ id: "dateDeCreation", title: "Date de création" },
	{ id: "nomSociete", title: "Nom Société" },
	{ id: "taille", title: "Taille" },
	{ id: "siret", title: "Siret" },
	{ id: "secteur", title: "Secteur" },
	{ id: "codePostal", title: "Code postal" },
	{ id: "ville", title: "Ville" },
	{ id: "nom", title: "Nom" },
	{ id: "prenom", title: "Prénom" },
	{ id: "email", title: "Email" },
	{ id: "telephone", title: "Téléphone" },
	{ id: "travail", title: "Travail" },
	{ id: "nombreARecruter", title: "Nombre à recruter" },
	{ id: "commentaire", title: "Commentaire" },
	{ id: "erreur", title: "Erreur" },
];
const contactPoes = [
	ContactPoeFixtureBuilder.build(),
	ContactPoeFixtureBuilder.build({ id: "2" }),
];
let logger: StubbedType<Logger>;
let httpClient: StubbedType<AxiosInstance>;
let fileSystemClient: StubbedType<FileSystemClient>;
let minioClient: StubbedClass<Client>;
let configuration: StubbedType<Configuration>;
let dateService: StubbedClass<DateService>;
let strapiHttpClient: StubbedClass<StrapiHttpClient>;
let contactPoeRepository: HttpMinioContactPoeRepository;

describe("HttpMinioContactPoeRepositoryTest", () => {
	beforeEach(() => {
		logger = stubInterface<Logger>(sinon);
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		dateService = stubClass(DateService);
		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.BUCKET_NAME_EXPORT_POE = "bucket-name";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp";
		configuration.CONTACTS_POE.FILR_URL = `https://mesfichiers.some-url.net?file_name=${fileName}`;
		configuration.CONTACTS_POE.FILR_PASSWORD = "s0m3P4$$wOrd";
		configuration.CONTACTS_POE.FILR_USERNAME = "someUser";
		configuration.STRAPI.POE_ENDPOINT = "contact-poes";
		httpClient = stubInterface<AxiosInstance>(sinon);
		minioClient = stubClass(Client);
		strapiHttpClient = stubClass(StrapiHttpClient);

		contactPoeRepository = new HttpMinioContactPoeRepository(strapiHttpClient, minioClient, dateService, fileSystemClient, httpClient as unknown as AxiosInstance, configuration, logger);
	});

	context("Lorsque j'envoie les données contacts POE", () => {
		context("et que tout se passe bien", () => {
			it("copie les contacts POE", async () => {
				// Given
				dateService.maintenant.returns(date);
				dateService.toFormat.restore();

				// When
				await contactPoeRepository.envoyerLesContactsPoeAPoleEmploi(contactPoes);

				// Then
				expect(fileSystemClient.writeCsv).to.have.been.calledOnceWith(fileNameIncludingPath, contactPoes, headers);
				expect(minioClient.fPutObject).to.have.been.calledOnceWith(
					configuration.MINIO.BUCKET_NAME_EXPORT_POE,
					fileName,
					fileNameIncludingPath,
				);
			});

			it("envoie les contacts POE à Pôle Emploi", async () => {
				// Given
				const fileContentAsBuffer = new PassThrough(Buffer.from("Some Content"));
				fileSystemClient
					.read
					.withArgs(fileNameIncludingPath)
					.resolves(fileContentAsBuffer);
				dateService.maintenant.returns(date);
				dateService.toFormat.restore();

				// When
				await contactPoeRepository.envoyerLesContactsPoeAPoleEmploi(contactPoes);

				// Then
				expect(httpClient.post).to.have.been.calledOnceWith(
					configuration.CONTACTS_POE.FILR_URL,
					fileContentAsBuffer, {
						auth: {
							username: configuration.CONTACTS_POE.FILR_USERNAME,
							password: configuration.CONTACTS_POE.FILR_PASSWORD,
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
					dateService.maintenant.returns(date);
					dateService.toFormat.restore();
					const axiosError = new AxiosError("Oops something went wrong!", "404");
					httpClient.post.rejects(axiosError);

					// When Then
					await expect(contactPoeRepository.envoyerLesContactsPoeAPoleEmploi(contactPoes)).to.be.rejectedWith(axiosError);
					expect(logger.error).to.have.been.calledOnceWith({
						msg: "L'envoi du fichier des contacts POE à Pôle Emploi a échoué",
						extra: { error: JSON.stringify(axiosError) },
					});
				});
			});

			it("log l'erreur qui s'est produite et remonte l'erreur", async () => {
				// Given
				dateService.maintenant.returns(date);
				dateService.toFormat.restore();
				const error = new Error("Oops something went wrong!");
				httpClient.post.rejects(error);

				// When Then
				await expect(contactPoeRepository.envoyerLesContactsPoeAPoleEmploi(contactPoes)).to.be.rejectedWith(error);
				expect(logger.error).to.have.been.calledOnceWith({
					msg: "Une erreur d'écriture est survenue avant l'envoi du fichier des contacts POE",
					extra: { error: JSON.stringify(error) },
				});
			});
		});
	});

	it("recupère les contacts POE", async () => {
		// Given
		const contactPoe = ContactPoeFixtureBuilder.build();
		strapiHttpClient
			.get
			.resolves([ContactPoeFixtureBuilder.buildStrapi()]);

		// When
		const contactsPoe = await contactPoeRepository.recupererLesContactsPoe();

		// Then
		expect(strapiHttpClient.get).to.have.been.calledOnceWithExactly(
			"contact-poes",
			"nom_societe,code_postal,ville,siret,taille,secteur,prenom,telephone,nom,travail,erreur,nombreARecruter,commentaire,email,createdAt",
			""
		);
		expect(contactsPoe).to.have.deep.members([{ ...contactPoe }]);
	});

	context("Lorsque la suppression d'un contact POE fonctionne correctement", () => {
		it("supprime les contacts POE", async () => {
			// Given
			const contactsPoes = [
				ContactPoeFixtureBuilder.build({ id: "1" }),
				ContactPoeFixtureBuilder.build({ id: "2" }),
				ContactPoeFixtureBuilder.build({ id: "3" }),
			];

			// When
			await contactPoeRepository.supprimerLesContactsEnvoyesAPoleEmploi(contactsPoes);

			// Then
			expect(strapiHttpClient.delete.callCount).to.eql(3);
			expect(strapiHttpClient.delete.getCall(0).args).to.deep.equal(["contact-poes", "1"]);
			expect(strapiHttpClient.delete.getCall(1).args).to.deep.equal(["contact-poes", "2"]);
			expect(strapiHttpClient.delete.getCall(2).args).to.deep.equal(["contact-poes", "3"]);
		});
	});

	context("Lorsque la suppression d'un contact POE échoue", () => {
		it("log les contacts POE tombés en erreur", async () => {
			// Given
			const contactsPoes = [
				ContactPoeFixtureBuilder.build({ id: "1" }),
				ContactPoeFixtureBuilder.build({ id: "2" }),
				ContactPoeFixtureBuilder.build({ id: "3" }),
			];

			strapiHttpClient
				.delete
				.withArgs("contact-poes", "2")
				.rejects(new Error("Oops! Something went wrong :-("));

			// When
			await contactPoeRepository.supprimerLesContactsEnvoyesAPoleEmploi(contactsPoes);

			// Then
			expect(logger.info).to.have.been.calledWith("Deletion of contact poe with id=[2] has failed");
		});
	});
});
