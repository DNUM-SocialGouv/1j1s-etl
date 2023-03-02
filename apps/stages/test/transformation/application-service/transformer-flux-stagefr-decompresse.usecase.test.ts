import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";

import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { StagefrDecompresse } from "@stages/src/transformation/domain/model/stagefr-decompresse";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { Convertir } from "@stages/src/transformation/domain/service/stagefr-decompresse/convertir.domain-service";
import { OffreDeStageFixtureBuilder } from "@stages/test/transformation/fixture/offre-de-stage.fixture-builder";
import {
	OffreDeStageStagefrDecompresseFixtureBuilder,
} from "@stages/test/transformation/fixture/offre-de-stage-stagefr-decompresse.fixture-builder";

const now = new Date("2022-06-01T00:00:00.000Z");

let flux: FluxTransformation;
let offresDeStage1Jeune1Solution: Array<UnJeune1Solution.OffreDeStage>;
let offresDeStageStagefrDecompresse: Array<StagefrDecompresse.OffreDeStage>;

let dateService: StubbedType<DateService>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertir: Convertir;
let usecase: TransformerFluxStagefrDecompresse;

describe("TransformerFluxStagefrDecompresseTest", () => {
	before(() => {
		flux = new FluxTransformation("stagefr-decompresse", "test", ".xml", ".json");
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

			convertir = new Convertir(dateService, assainisseurDeTexte);

			usecase = new TransformerFluxStagefrDecompresse(offreDeStageRepository, convertir);
		});

		it("je le sauvegarde au format 1Jeune1Solution", async () => {
			await usecase.executer(flux);

			expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
			expect(offreDeStageRepository.recuperer).to.have.been.calledWith(
				new FluxTransformation("stagefr-decompresse", "test", ".xml", ".json"),
			);

			expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			expect(offreDeStageRepository.sauvegarder).to.have.been.calledWith(offresDeStage1Jeune1Solution);
		});
	});
});
