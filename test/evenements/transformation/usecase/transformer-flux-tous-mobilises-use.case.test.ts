import sinon from "sinon";

import {
    aCorruptedFluxTousMobilises,
    aTousMobilisesFlux, aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre,
} from "@test/evenements/fixture/tous-mobilises.fixture";
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

            expect(repo.sauvegarder).to.calledWith(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre(), flux);
        });
    });

    context("lorsque je récupère un item qui n'a pas de date dans le flux", () => {
        beforeEach(() => {
            repo.recuperer.resolves(aCorruptedFluxTousMobilises());
        });

        it("je l'ignore et je retourne une liste d'évenement d'un jeune une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.calledWith(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre(), flux);
        });
    });
});
