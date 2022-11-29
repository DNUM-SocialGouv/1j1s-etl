import sinon from "sinon";

import {
    aCorruptedFluxTousMobilises,
    aTousMobilisesFlux,
} from "@test/evenements/transformation/fixture/tous-mobilises.fixture";
import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { EvenementsRepository } from "@evenements/transformation/domain/evenements.repository";
import { expect } from "@test/configuration";
import { FluxTransformation } from "@stages/transformation/domain/flux";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { TransformerFluxTousMobilisesUseCase } from "@evenements/transformation/usecase/transformer-flux-tous-mobilises-use.case";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import VersTousMobilises = TousMobilises.Convertir;

describe("TransformerFluxTousMobilisesUsecase", () => {
    let useCase: TransformerFluxTousMobilisesUseCase;
    let repo: StubbedType<EvenementsRepository>;
    let sanitized: StubbedType<AssainisseurDeTexte>;
    let flux: FluxTransformation;

    beforeEach(() => {
        repo = stubInterface<EvenementsRepository>(sinon);
        sanitized = stubInterface<AssainisseurDeTexte>(sinon);
        sanitized.nettoyer.withArgs("**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi").returns("**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi");
        sanitized.nettoyer.withArgs("Merci de contacter votre conseiller Pôle emploi afin de vous positionner.").returns("Merci de contacter votre conseiller Pôle emploi afin de vous positionner.");

        flux = new FluxTransformation("tous-mobilises", "history", ".json", ".json");

        useCase = new TransformerFluxTousMobilisesUseCase(repo, new VersTousMobilises(new DateService(), sanitized));
    });

    context("quand je récupère un flux provenent du flux tous mobilises", () => {

        beforeEach(() => {
            repo.recuperer.resolves(aTousMobilisesFlux());
        });

        it("je retourne une liste d'évenement d'un jeune une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.calledWith([
                {
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
                },
                {
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
                },
            ], flux);
        });
    });

    context("lorsque je récupère un item qui n'a pas de date dans le flux", () => {
        beforeEach(() => {
            repo.recuperer.resolves(aCorruptedFluxTousMobilises());
        });

        it("je l'ignore et je retourne une liste d'évenement d'un jeune une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.calledWith([
                {
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
                },
                {
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
                },
            ], flux);
        });
    });
});
