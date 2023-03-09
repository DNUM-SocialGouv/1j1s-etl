import { AnnonceDeLogementRepository } from "@maintenance/src/domain/service/annonce-de-logement.repository";

import { Usecase } from "@shared/src/application-service/usecase";

export class PurgerLesAnnoncesDeLogement implements Usecase {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(flows: Array<string>): Promise<void> {
		const annoncesDeLogement = await this.annonceDeLogementRepository.recuperer(flows);
		await this.annonceDeLogementRepository.supprimer(annoncesDeLogement);
	}
}
