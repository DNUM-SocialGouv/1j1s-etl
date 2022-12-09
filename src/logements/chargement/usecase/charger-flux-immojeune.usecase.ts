import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { UnJeune1solution } from "@logements/chargement/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class ChargerFluxImmojeune implements Usecase {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(): Promise<void> {
		const annoncesDeLogementNonReferencees = this.annonceDeLogementRepository.recuperer();
		const annoncesDeLogementReferencees = this.annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees();

		const nouvellesAnnoncesDeLogementACharger = this.filtrerLesNouvellesAnnoncesDeLogementACharger(annoncesDeLogementNonReferencees, annoncesDeLogementReferencees);

		this.annonceDeLogementRepository.charger(nouvellesAnnoncesDeLogementACharger);
	}

	private filtrerLesNouvellesAnnoncesDeLogementACharger(
		annoncesDeLogementNonReferencees: Array<UnJeune1solution.AnnonceDeLogement>,
		annoncesDeLogementReferencees: Array<UnJeune1solution.AnnonceDeLogement>
	): Array<UnJeune1solution.AnnonceDeLogement> {
		return annoncesDeLogementNonReferencees
			.filter((annonceDeLogement) => {
				const identifiantsSourcesReferences = annoncesDeLogementReferencees.map((annonceDeLogementReferencee) => annonceDeLogementReferencee.identifiantSource);
				return !(identifiantsSourcesReferences.includes(annonceDeLogement.identifiantSource));
			});
	}
}
