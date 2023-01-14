import { IndexerAnnoncesDeLogement } from "@logements/indexation/service/indexer-annonces-de-logement.service";
import { AnnonceDeLogementRepository } from "@logements/indexation/service/types";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { expect } from "@test/configuration";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/indexation/fixture/annonce-de-logement.fixture-builder";
import sinon from "sinon";

let source: string;
let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let indexerAnnoncesDeLogement: IndexerAnnoncesDeLogement;

describe("IndexerAnnoncesDeLogement", () => {
	beforeEach(() => {
		source = "immojeune";
		annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
		indexerAnnoncesDeLogement = new IndexerAnnoncesDeLogement(annonceDeLogementRepository);
	});

	it("indexe les annonces de logement", async () => {
		// Given
		annonceDeLogementRepository.recupererLesAnnonces.resolves([
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogement(),
		]);

		// When
		await indexerAnnoncesDeLogement.executer(source);

		// Then
		const annoncesDeLogement = [AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementAIndexer()];
		expect(annonceDeLogementRepository.indexer.getCall(0).args[0]).to.have.deep.members(annoncesDeLogement);
	});

	it("récupère les annonces de logement d'une source donnée", async () => {
		// Given
		annonceDeLogementRepository.recupererLesAnnonces.withArgs(source).resolves([]);

		// When
		await indexerAnnoncesDeLogement.executer(source);

		// Then
		expect(annonceDeLogementRepository.recupererLesAnnonces).to.have.been.calledOnceWithExactly("immojeune");
	});
});
