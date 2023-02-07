import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { Convertir } from "@stages/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";
import { FluxTransformation } from "@stages/transformation/domain/model/flux";
import { OffreDeStageFixtureBuilder } from "@test/stages/transformation/fixture/offre-de-stage.fixture-builder";
import { OffreDeStageRepository } from "@stages/transformation/domain/service/offre-de-stage.repository";
import {
	OffreDeStageStagefrCompresseFixtureBuilder,
} from "../fixture/offre-de-stage-stagefr-compresse.fixture-builder";
import { StagefrCompresse } from "@stages/transformation/domain/model/stagefr-compresse";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import { UnJeune1Solution } from "@stages/transformation/domain/model/1jeune1solution";

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