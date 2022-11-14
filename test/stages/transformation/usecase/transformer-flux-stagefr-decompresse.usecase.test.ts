import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { AssainisseurDeTexte } from "@stages/transformation/domain/assainisseur-de-texte";
import { Flux } from "@stages/transformation/domain/flux";
import { DateService } from "@shared/date.service";
import { expect } from "@test/configuration";
import { OffreDeStageFixtureBuilder } from "@test/stages/transformation/fixture/offre-de-stage.fixture-builder";
import { OffreDeStageRepository } from "@stages/transformation/domain/offre-de-stage.repository";
import {
	OffreDeStageStagefrDecompresseFixtureBuilder,
} from "@test/stages/transformation/fixture/offre-de-stage-stagefr-decompresse.fixture-builder";
import { StagefrDecompresse } from "@stages/transformation/domain/stagefr-decompresse";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/transformation/usecase/transformer-flux-stagefr-decompresse.usecase";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";

const now = new Date("2022-06-01T00:00:00.000Z");

let flux: Flux;
let offresDeStage1Jeune1Solution: Array<UnJeune1Solution.OffreDeStage>;
let offresDeStageStagefrDecompresse: Array<StagefrDecompresse.OffreDeStage>;

let dateService: StubbedType<DateService>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertir: StagefrDecompresse.Convertir;
let usecase: TransformerFluxStagefrDecompresse;

describe("TransformerFluxStagefrDecompresseTest", () => {
	before(() => {
		flux = {
			nom: "stagefr-decompresse",
			dossierHistorisation: "test",
			extensionFichierBrut: ".xml",
			extensionFichierTransforme: ".json",
		};
	});

	context("Lorsque je souhaite transformer le flux stagefr decompressé et que tout va bien", () => {
		beforeEach(() => {
			const offreDeStage1Jeune1Solution = OffreDeStageFixtureBuilder.build({ source: UnJeune1Solution.Source.STAGEFR_DECOMPRESSE });
			delete offreDeStage1Jeune1Solution.remunerationBase;
			delete offreDeStage1Jeune1Solution.dureeEnJour;
			delete offreDeStage1Jeune1Solution.dureeEnJourMax;
			delete offreDeStage1Jeune1Solution.employeur?.description;
			delete offreDeStage1Jeune1Solution.employeur?.siteUrl;
			delete offreDeStage1Jeune1Solution.localisation?.codePostal;
			delete offreDeStage1Jeune1Solution.localisation?.departement;
			delete offreDeStage1Jeune1Solution.teletravailPossible;

			offresDeStageStagefrDecompresse = [OffreDeStageStagefrDecompresseFixtureBuilder.build()];

			offresDeStage1Jeune1Solution = [offreDeStage1Jeune1Solution];

			offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
			offreDeStageRepository
				.recuperer
				.withArgs(flux)
				.resolves({ jobs: { job: offresDeStageStagefrDecompresse } });

			dateService = stubInterface<DateService>(sinon);
			dateService.maintenant.returns(now);

			assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
			assainisseurDeTexte.nettoyer.withArgs("Titre de l'offre").returns("Titre de l'offre");
			assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
			assainisseurDeTexte.nettoyer.withArgs("Description de l'offre").returns("Description de l'offre");

			convertir = new StagefrDecompresse.Convertir(dateService, assainisseurDeTexte);

			usecase = new TransformerFluxStagefrDecompresse(offreDeStageRepository, convertir);
		});

		it("je le sauvegarde au format 1Jeune1Solution", async () => {
			await usecase.executer(flux);

			expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
			expect(offreDeStageRepository.recuperer).to.have.been.calledWith({ ...flux });

			expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			expect(offreDeStageRepository.sauvegarder).to.have.been.calledWith(offresDeStage1Jeune1Solution);
		});
	});
});
