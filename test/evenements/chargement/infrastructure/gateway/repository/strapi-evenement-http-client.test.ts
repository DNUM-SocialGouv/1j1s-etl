import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import nock from "nock";
import sinon, { spy } from "sinon";

import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { expect } from "@test/configuration";
import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";
import {
	StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/repository/strapi-evenement-http-client";
import {
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges,
} from "@test/evenements/fixture/tous-mobilises.fixture";

const source = "tous-mobilises";
const url = "evenements";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const evenementASupprimer: UnjeuneUneSolutionChargement.EvenementASupprimer = {
	id: 1,
	dateDebut: "2022-11-24T09:00:00",
	description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
	idSource: "272709",
	lieuEvenement: "Matha",
	modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
	online: false,
	organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
	titreEvenement: "Pôle emploi - Recrutement ADEF+",
	typeEvenement: "job_dating",
	source: "tous-mobilises",
	dateFin: "2022-11-24T12:00:00",
};

const evenementAMettreAJour: UnjeuneUneSolutionChargement.EvenementAMettreAJour = {
	id: 1,
	dateDebut: "2022-11-24T09:00:00",
	description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
	idSource: "272709",
	lieuEvenement: "Matha",
	modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
	online: false,
	organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
	titreEvenement: "Pôle emploi - Recrutement ADEF+",
	typeEvenement: "job_dating",
	source: "tous-mobilises",
	dateFin: "2022-11-24T12:00:00",
};

const evenementAAJouter: UnjeuneUneSolutionChargement.EvenementAAjouter = {
	dateDebut: "2022-11-24T08:30:00",
	description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
	idSource: "272510",
	lieuEvenement: "Clermont",
	modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
	online: false,
	organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
	titreEvenement: "Pôle emploi - LACTALIS",
	typeEvenement: "seance_information",
	source: "tous-mobilises",
	dateFin: "2022-11-24T16:15:00",
};

let spyOnDelete: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPost: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPut: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnAuthentication: sinon.SinonSpy<[axiosInstance: AxiosInstance], Promise<void>>;
let spyOnGet: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;

let axiosInstance: AxiosInstance;
let authClient: AuthenticationClient;
let strapiEvenementHttpClient: StrapiEvenementHttpClient;

describe("StrapiEvenementHttpClientTest", () => {
	beforeEach(() => {
		axiosInstance = axios.create({
			baseURL: "http://localhost:1337/api",
		});

		authClient = new AuthenticationClient(
			"/auth/local",
			{ username: "login@example.com", password: "somePassWord123" },
		);

		spyOnDelete = spy(axiosInstance, "delete");
		spyOnPost = spy(axiosInstance, "post");
		spyOnPut = spy(axiosInstance, "put");
		spyOnGet = spy(axiosInstance, "get");
		spyOnAuthentication = spy(authClient, "handleAuthentication");

		nock("http://localhost:1337/api")
			.post("/auth/local")
			.reply(200, { jwt })
			.delete("/evenements/1")
			.reply(200)
			.post("/evenements", { data: { ...evenementAAJouter } })
			.reply(200)
			.put("/evenements/1", { data: { ...evenementAMettreAJour } })
			.reply(200)
			.get(`/evenements?filters[source][$eq]=${encodeURI("tous-mobilises")}&pagination[pageSize]=100`)
			.reply(200, { "data":[{ "id":1,"attributes":{ "description":"Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves","idSource":"272709","lieuEvenement":"Matha","modaliteInscription":"**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi","online":false,"organismeOrganisateur":"Agence pôle emploi - SAINT JEAN D ANGELY","titreEvenement":"Pôle emploi - Recrutement ADEF+","typeEvenement":"job_dating","source":"tous-mobilises","slug":"272709","createdAt":"2022-12-02T10:04:05.112Z","updatedAt":"2022-12-02T10:50:27.577Z","publishedAt":"2022-12-02T10:04:06.274Z","dateDebut":"2022-11-24T08:00:00.000Z","dateFin":"2022-11-24T11:00:00.000Z" } },{ "id":2,"attributes":{ "description":"Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ","idSource":"272510","lieuEvenement":"Clermont","modaliteInscription":"Merci de contacter votre conseiller Pôle emploi afin de vous positionner.","online": false,"organismeOrganisateur":"Agence pôle emploi - CLERMONT FITZ JAMES","titreEvenement":"Pôle emploi - LACTALIS","typeEvenement":"seance_information","source":"tous-mobilises","slug":"272510","createdAt":"2022-12-02T10:51:54.650Z","updatedAt":"2022-12-02T11:08:39.622Z","publishedAt":"2022-12-02T11:08:39.618Z","dateDebut":"2022-11-24T07:30:00.000Z","dateFin":"2022-11-24T15:15:00.000Z" } }],"meta":{ "pagination":{ "page":1,"pageSize":25,"pageCount":1,"total":2 } } });

		strapiEvenementHttpClient = new StrapiEvenementHttpClient(axiosInstance, authClient, url);
	});

	context("Lorsque je supprime une evenement", () => {
		it("je fais un appel HTTP delete avec le bon identifiant", async () => {
			await strapiEvenementHttpClient.delete(evenementASupprimer);

			expect(spyOnDelete).to.have.been.calledOnce;
			expect(spyOnDelete).to.have.been.calledWith("evenements/1");

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque je mets à jour une evenement", () => {
		it("je fais un appel HTTP avec le bon identifiant et le bon contenu", async () => {
			await strapiEvenementHttpClient.put(evenementAMettreAJour);

			expect(spyOnPut).to.have.been.calledWith(
				"evenements/1",
				{ data: evenementAMettreAJour },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque j'ajoute un nouveau evenement", () => {
		it("je fais un appel HTTP avec le bon contenu", async () => {
			await strapiEvenementHttpClient.post(evenementAAJouter);

			expect(spyOnPost).to.have.been.calledWith(
				url,
				{ data: evenementAAJouter },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque je récupère les évenements d'une source", () => {
		it("je fais un appel HTTP avec la bonne source", async () => {
			const resultat = await strapiEvenementHttpClient.getAll(source);

			expect(resultat).to.have.deep.members(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges());
			expect(spyOnGet).to.have.been.calledWith("evenements", {
				params: {
					"filters[source][$eq]": encodeURI(source),
					"pagination[pageSize]": 100,
				},
			});
		});
	});
});
