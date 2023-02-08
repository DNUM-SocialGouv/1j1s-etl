import { AnnonceDeLogementRepository } from "@logements/indexation/domain/service/annonce-de-logement.repository";
import { Usecase } from "@shared/usecase";

export class IndexerAnnoncesDeLogement implements Usecase {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(source: string): Promise<void> {
		const annoncesDeLogementBrutes = await this.annonceDeLogementRepository.recupererLesAnnonces(source);
		const annoncesDeLogementAIndexer = annoncesDeLogementBrutes.map((annonceDeLogement) => annonceDeLogement.preparerPourIndexation());
		await this.annonceDeLogementRepository.indexerLesAnnonces(annoncesDeLogementAIndexer);
	}
}
