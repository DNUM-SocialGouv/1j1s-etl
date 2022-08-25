import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { expect } from "@test/configuration";
import { OffreDeStageFixtureBuilder } from "@test/transformation/fixture/offre-de-stage.fixture-builder";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { StagefrCompresse } from "@transformation/domain/stagefr-compresse";
import {
	TransformerFluxStagefrCompresse,
} from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { OffreDeStageStagefrCompresseFixtureBuilder } from "../fixture/offre-de-stage-stagefr-compresse.fixture-builder";

const now = new Date("2022-06-01T00:00:00.000Z");

let config: ConfigurationFlux;
let offresDeStage1Jeune1Solution: Array<UnJeune1Solution.OffreDeStage>;
let offresDeStageStagefrCompresse: Array<StagefrCompresse.OffreDeStage>;

let dateService: StubbedType<DateService>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertir: StagefrCompresse.Convertir;
let usecase: TransformerFluxStagefrCompresse;

describe("TransformerFluxStagefrCompresseTest", () => {
	before(() => {
		config = {
			nom: "stagefr-compresse",
			dossierHistorisation: "test",
			extensionFichierBrut: ".xml",
			extensionFichierTransforme: ".json",
		};
	});

	context("Lorsque je souhaite transformer le flux stagefr compressé et que tout va bien", () => {
		beforeEach(() => {
			const offreDeStage1Jeune1Solution = OffreDeStageFixtureBuilder.build(
				{ 
					identifiantSource : "100",
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
				.withArgs(config)
				.resolves({ jobs: { job: offresDeStageStagefrCompresse } });

			dateService = stubInterface<DateService>(sinon);
			dateService.maintenant.returns(now);

			assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
			assainisseurDeTexte.nettoyer.withArgs("Titre de l'offre").returns("Titre de l'offre");
			assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
			assainisseurDeTexte.nettoyer.withArgs("Description de l'offre").returns("Description de l'offre");

			convertir = new StagefrCompresse.Convertir(dateService, assainisseurDeTexte);

			usecase = new TransformerFluxStagefrCompresse(
				offreDeStageRepository,
				convertir
			);
		});

		it("je le sauvegarde au format 1Jeune1Solution", async () => {
			await usecase.executer(config);

			expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
			expect(offreDeStageRepository.recuperer).to.have.been.calledWith({ ...config });

			expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			expect(offreDeStageRepository.sauvegarder.getCall(0).firstArg).to.have.deep.members(offresDeStage1Jeune1Solution);
		});
	});
});
