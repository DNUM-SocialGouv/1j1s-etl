import {
    TransformerFluxTousMobilisesUsecase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises.usecase";
import { EvenementsRepository } from "@evenements/transformation/domain/evenements.repository";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import sinon from "sinon";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import { FluxTransformation } from "@stages/transformation/domain/flux";
import { expect } from "@test/configuration";
import { DateService } from "../../../../src/shared/date.service";

describe("TransformerFluxTousMobilisesUsecase", () => {
    context("quand je récupère un flux provenent du flux tous mobilises", () => {
        let useCase: TransformerFluxTousMobilisesUsecase;
        let repo: StubbedType<EvenementsRepository>;
        let flux: FluxTransformation;

        beforeEach(() => {
            repo = stubInterface<EvenementsRepository>(sinon);
            repo.recuperer.resolves([
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
            ]);
            flux = new FluxTransformation("tous-mobilises", "history", ".json", ".json");

            useCase = new TransformerFluxTousMobilisesUsecase(repo, new DateService());
        });

        it("je retourne une liste d'évenement d'un jeu une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.calledWith([
                {
                    dateDebut: "2022-11-24T08:00:00.000Z",
                    description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
                    idSource: "272709",
                    lieuEvenement: "Matha",
                    modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
                    online: false,
                    organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
                    titreEvenement: "Pôle emploi - Recrutement ADEF+",
                    typeEvenement: "job_dating",
                    source: "tous-mobilises",
                    dateFin: "2022-11-24T11:00:00.000Z",
                },
                {
                    dateDebut: "2022-11-24T07:30:00.000Z",
                    description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
                    idSource: "272510",
                    lieuEvenement: "Clermont",
                    modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
                    online: false,
                    organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
                    titreEvenement: "Pôle emploi - LACTALIS",
                    typeEvenement: "seance_information",
                    source: "tous-mobilises",
                    dateFin: "2022-11-24T15:15:00.000Z",
                },
            ], flux);
        });
    });
});