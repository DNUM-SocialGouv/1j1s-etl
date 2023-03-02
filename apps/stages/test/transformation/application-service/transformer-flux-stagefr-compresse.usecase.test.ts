import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";
import { expect, sinon, StubbedType, stubInterface } from "@shared/test/configuration";

import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { StagefrCompresse } from "@stages/src/transformation/domain/model/stagefr-compresse";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { Convertir } from "@stages/src/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import { OffreDeStageFixtureBuilder } from "@stages/test/transformation/fixture/offre-de-stage.fixture-builder";
import {
	OffreDeStageStagefrCompresseFixtureBuilder,
} from "@stages/test/transformation/fixture/offre-de-stage-stagefr-compresse.fixture-builder";

const now = new Date("2022-06-01T00:00:00.000Z");

let flux: FluxTransformation;
let offresDeStage1Jeune1Solution: Array<UnJeune1Solution.OffreDeStage>;
let offresDeStageStagefrCompresse: Array<StagefrCompresse.OffreDeStage>;

let dateService: StubbedType<DateService>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertir: Convertir;
let usecase: TransformerFluxStagefrCompresse;

describe("TransformerFluxStagefrCompresseTest", () => {
	before(() => {
		flux = new FluxTransformation("stagefr-compresse", "test", ".xml", ".json");
	});

	context("Lorsque je souhaite transformer le flux stagefr compressé et que tout va bien", () => {
		beforeEach(() => {
			const offreDeStage1Jeune1Solution = OffreDeStageFixtureBuilder.build(
				{
					identifiantSource: "100",
					source: UnJeune1Solution.Source.STAGEFR_COMPRESSE,
				},
				{ latitude: 10, longitude: 30 },
			);

			delete offreDeStage1Jeune1Solution.teletravailPossible;
			delete offreDeStage1Jeune1Solution.dureeEnJourMax;
			delete offreDeStage1Jeune1Solution.localisation?.departement;
			delete offreDeStage1Jeune1Solution.localisation?.region;
			delete offreDeStage1Jeune1Solution.employeur?.description;
			delete offreDeStage1Jeune1Solution.employeur?.siteUrl;

			offresDeStageStagefrCompresse = [OffreDeStageStagefrCompresseFixtureBuilder.build()];

			offresDeStage1Jeune1Solution = [offreDeStage1Jeune1Solution];

			offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
			offreDeStageRepository
				.recuperer
				.withArgs(flux)
				.resolves({ jobs: { job: offresDeStageStagefrCompresse } });

			dateService = stubInterface<DateService>(sinon);
			dateService.maintenant.returns(now);

			assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
			assainisseurDeTexte.nettoyer.withArgs("Titre de l'offre").returns("Titre de l'offre");
			assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
			assainisseurDeTexte.nettoyer.withArgs("Description de l'offre").returns("Description de l'offre");

			convertir = new Convertir(dateService, assainisseurDeTexte);

			usecase = new TransformerFluxStagefrCompresse(
				offreDeStageRepository,
				convertir,
			);
		});

		it("je le sauvegarde au format 1Jeune1Solution", async () => {
			await usecase.executer(flux);

			expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
			expect(offreDeStageRepository.recuperer).to.have.been.calledWith(
				new FluxTransformation("stagefr-compresse", "test", ".xml", ".json"),
			);

			expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			expect(offreDeStageRepository.sauvegarder.getCall(0).firstArg).to.have.deep.members(offresDeStage1Jeune1Solution);
		});
	});
});
