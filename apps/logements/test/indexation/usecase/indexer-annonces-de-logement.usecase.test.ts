import { IndexerAnnoncesDeLogement } from "@logements/src/indexation/application-service/indexer-annonces-de-logement.usecase";
import { AnnonceDeLogementRepository } from "@logements/src/indexation/domain/service/annonce-de-logement.repository";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/indexation/fixture/annonce-de-logement.fixture-builder";

import { expect, sinon, StubbedType, stubInterface } from "@shared/test/configuration";

const source = "immojeune";
let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let indexerAnnoncesDeLogement: IndexerAnnoncesDeLogement;

describe("IndexerAnnoncesDeLogement", () => {
	beforeEach(() => {
		annonceDeLogementRepository = stubInterface(sinon);
		indexerAnnoncesDeLogement = new IndexerAnnoncesDeLogement(annonceDeLogementRepository);
	});

	it("indexe les annonces de logement", async () => {
		// Given
		const annoncesDeLogementAIndexer = [AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementAIndexer()];
		annonceDeLogementRepository
			.recupererLesAnnonces
			.withArgs(source)
			.resolves([AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute()]);

		// When
		await indexerAnnoncesDeLogement.executer(source);

		// Then
		expect(annonceDeLogementRepository.indexerLesAnnonces).to.have.been.calledOnce;
		expect(annonceDeLogementRepository.indexerLesAnnonces).to.have.been.calledWith(annoncesDeLogementAIndexer);
		expect(annonceDeLogementRepository.recupererLesAnnonces).to.have.been.calledOnce;
		expect(annonceDeLogementRepository.recupererLesAnnonces).to.have.been.calledWith("immojeune");
	});
});
