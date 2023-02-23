import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Axios, AxiosError } from "axios";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";

import { Configuration } from "@evenements/src/extraction/configuration/configuration";
import {
	TousMobilisesBasicFlowHttpClient,
} from "@evenements/src/extraction/infrastructure/gateway/client/tous-mobilises-basic-flow-http.client";

import { Logger } from "@shared/src/configuration/logger";
import { AuthentificationErreur, LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";

let errorCode: number;
let url: string;
let token: string;
let axios: StubbedClass<Axios>;
let logger: StubbedType<Logger>;
let configuration: StubbedType<Configuration>;
let eventsBasicFlowHttpClient: TousMobilisesBasicFlowHttpClient;

describe("EventsBasicFlowHttpClientTest", () => {
	beforeEach(() => {
		configuration = stubInterface<Configuration>(sinon);
		logger = stubInterface<Logger>(sinon);
		axios = stubClass(Axios, {});
		url = "http://flux";
		token = "bearertoken";
		eventsBasicFlowHttpClient = new TousMobilisesBasicFlowHttpClient(axios, configuration);

		configuration.TOUS_MOBILISES.DIRECTORY_NAME = "DIRECTORY_NAME";
		configuration.TOUS_MOBILISES.FLUX_URL = "http://flux";
		configuration.TOUS_MOBILISES.NAME = "NAME";
		configuration.TOUS_MOBILISES.RAW_FILE_EXTENSION = "RAW_FILE_EXTENSION";
		configuration.TOUS_MOBILISES.AUTH_URL = "http://auth";
		configuration.TOUS_MOBILISES.CLIENT_ID = "CLIENT_ID";
		configuration.TOUS_MOBILISES.CLIENT_SECRET = "CLIENT_SECRET";
		configuration.TOUS_MOBILISES.SCOPE = "SCOPE";
	});

	context("Lorsque je récupère un flux existant", () => {
		beforeEach(() => {
			axios.post.resolves({ data: { access_token: token } });
			axios.get.resolves({ data: aApiPoleEmploiEventsTousMobilisesResponse });
		});

		it("je le retourne au format textuel avec un stringify car axios interprète la réponse comme un object", async () => {
			const result = await eventsBasicFlowHttpClient.pull(url, logger);

			expect(axios.get).to.calledWith("http://flux", { headers: { Authorization: "Bearer bearertoken" } });
			expect(result).to.eq(JSON.stringify(aApiPoleEmploiEventsTousMobilisesResponse));
		});
	});

	context("Lorsque je récupère un flux existant et que l'authent ne fonctionne pas", () => {
		beforeEach(() => {
			errorCode = 403;
			axios.post.rejects(new AxiosError("Forbidden", errorCode.toString()));
		});

		it("je retourne une erreur d'authentification", async () => {
			await expect(eventsBasicFlowHttpClient.pull(url, logger)).to.be.rejectedWith(
				AuthentificationErreur,
				"Une erreur est survenue lors de l'authentification pour le flux NAME",
			);
		});
	});

	context("Lorsque je récupère un flux qui n'existe pas", () => {
		beforeEach(() => {
			axios.post.resolves({ data: { access_token: token } });
			errorCode = 500;
			axios.get.rejects(new AxiosError("Some error", errorCode.toString()));
		});

		it("je lance une erreur", async () => {
			await expect(eventsBasicFlowHttpClient.pull(url, logger)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`,
			);
		});
	});
});

const aApiPoleEmploiEventsTousMobilisesResponse = [
	{
		"date": "24/11/2022",
		"description": "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
		"horaireDebutEvenement": "09:00",
		"horaireFinEvenement": "12:00",
		"id": "272709",
		"lieuEvenement": "Matha",
		"modaliteInscription": "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
		"online": false,
		"organismeOrganisateur": "Agence pôle emploi - SAINT JEAN D ANGELY",
		"titreEvenement": "Pôle emploi - Recrutement ADEF+",
		"typeEvenement": "job_dating",
	},
	{
		"date": "24/11/2022",
		"description": "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
		"horaireDebutEvenement": "08:30",
		"horaireFinEvenement": "16:15",
		"id": "272510",
		"lieuEvenement": "Clermont",
		"modaliteInscription": "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
		"online": false,
		"organismeOrganisateur": "Agence pôle emploi - CLERMONT FITZ JAMES",
		"titreEvenement": "Pôle emploi - LACTALIS",
		"typeEvenement": "seance_information",
	},
];
