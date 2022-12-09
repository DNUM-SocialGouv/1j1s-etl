import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class ChargerFluxImmojeune implements Usecase {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(): Promise<void> {
		const annoncesDeLogementNonReferencees = this.annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees();
		const annoncesDeLogementReferencees = this.annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees();

		const nouvellesAnnoncesACharger = this.filtrerLesNouvellesAnnoncesACharger(annoncesDeLogementReferencees, annoncesDeLogementNonReferencees);
		const annoncesASupprimer = this.filtrerLesAnnoncesASupprimer(annoncesDeLogementReferencees, annoncesDeLogementNonReferencees);
		const annoncesAMettreAJour = this.filtrerLesAnnoncesAMettreAJour(annoncesDeLogementNonReferencees, annoncesDeLogementReferencees);

		this.annonceDeLogementRepository.publier(nouvellesAnnoncesACharger);
		this.annonceDeLogementRepository.supprimer(annoncesASupprimer);
		this.annonceDeLogementRepository.mettreAJour(annoncesAMettreAJour);
	}

	private filtrerLesNouvellesAnnoncesACharger(
		annoncesDeLogementReferencees: Array<UnJeune1Solution.AnnonceDeLogement>,
		annoncesDeLogementNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement>,
	): Array<UnJeune1Solution.AnnonceDeLogement> {
		return annoncesDeLogementNonReferencees
			.filter((annonceDeLogement) => {
				const identifiantsSourcesReferences = annoncesDeLogementReferencees
					.map((annonceDeLogementReferencee) => annonceDeLogementReferencee.identifiantSource);
				return !(identifiantsSourcesReferences.includes(annonceDeLogement.identifiantSource));
			});
	}

	private filtrerLesAnnoncesASupprimer(
		annoncesDeLogementReferencees: Array<UnJeune1Solution.AnnonceDeLogement>,
		annoncesDeLogementNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement>,
	): Array<UnJeune1Solution.AnnonceDeLogement> {
		return annoncesDeLogementReferencees
			.filter((annonceReferencee) => {
				const identifiantsSourceNonReferences = annoncesDeLogementNonReferencees
					.map((annonceNonReferencee) => annonceNonReferencee.identifiantSource);
				return !(identifiantsSourceNonReferences.includes(annonceReferencee.identifiantSource));
			});
	}

	private filtrerLesAnnoncesAMettreAJour(annoncesNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement>, annoncesReferencees: Array<UnJeune1Solution.AnnonceDeLogement>) {
		return annoncesNonReferencees
			.filter((annonceNonReferencee) => {
				const identifiantsSourceReferences = annoncesReferencees
					.map((annonceReferencee) => annonceReferencee.identifiantSource);
				const annonceReferencee = annoncesReferencees.find((annonceDejaReferencee) => annonceDejaReferencee.identifiantSource === annonceNonReferencee.identifiantSource);

				return annonceReferencee && new Date(annonceReferencee.sourceUpdatedAt).getTime() < new Date(annonceNonReferencee.sourceUpdatedAt).getTime();
			});
	}
}
