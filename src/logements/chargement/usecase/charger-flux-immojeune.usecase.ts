import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { FluxLogement } from "@logements/chargement/domain/flux";
import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class ChargerFluxImmojeune implements Usecase {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(flux: FluxLogement): Promise<void> {
		const annoncesDeLogementACharger = await this.annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees(flux);
		const annoncesDeLogementDejaChargees = await this.annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees(flux);

		const nouvellesAnnonces = this.filtrerLesNouvellesAnnoncesACharger(annoncesDeLogementDejaChargees, annoncesDeLogementACharger);
		const annoncesObsoletes = this.filtrerLesAnnoncesASupprimer(annoncesDeLogementDejaChargees, annoncesDeLogementACharger);
		const annoncesAMettreAJour = this.filtrerLesAnnoncesAMettreAJour(annoncesDeLogementDejaChargees, annoncesDeLogementACharger);

		const annoncesEnErreur = await this.annonceDeLogementRepository.charger([
			...nouvellesAnnonces,
			...annoncesObsoletes,
			...annoncesAMettreAJour,
		], flux.nom);

		await this.annonceDeLogementRepository.preparerLeSuivi(nouvellesAnnonces, flux);
		await this.annonceDeLogementRepository.preparerLeSuivi(annoncesObsoletes, flux);
		await this.annonceDeLogementRepository.preparerLeSuivi(annoncesAMettreAJour, flux);
		await this.annonceDeLogementRepository.preparerLeSuivi(annoncesEnErreur, flux);
	}

	private filtrerLesNouvellesAnnoncesACharger(
		annoncesDeLogementDejaChargees: Array<UnJeune1Solution.AnnonceDeLogementReferencee>,
		annoncesDeLogementACharger: Array<UnJeune1Solution.AnnonceDeLogement>,
	): Array<UnJeune1Solution.NouvelleAnnonceDeLogement> {
		const identifiantsSourcesReferences = annoncesDeLogementDejaChargees
			.map((annonceReferencee) => annonceReferencee.identifiantSource);
		return annoncesDeLogementACharger
			.filter((annonceDeLogement) => !(identifiantsSourcesReferences.includes(annonceDeLogement.identifiantSource)))
			.map((annonceDeLogement) => new UnJeune1Solution.NouvelleAnnonceDeLogement(annonceDeLogement.recupererAttributs()));
	}

	private filtrerLesAnnoncesASupprimer(
		annoncesDeLogementReferencees: Array<UnJeune1Solution.AnnonceDeLogementReferencee>,
		annoncesDeLogementACharger: Array<UnJeune1Solution.AnnonceDeLogement>,
	): Array<UnJeune1Solution.AnnonceDeLogementObsolete> {
		const identifiantsSourceACharger = annoncesDeLogementACharger
			.map((annonceNonReferencee) => annonceNonReferencee.identifiantSource);
		return annoncesDeLogementReferencees
			.filter((annonceReferencee) => !(identifiantsSourceACharger.includes(annonceReferencee.identifiantSource)))
			.map((annonceObsolete) => new UnJeune1Solution.AnnonceDeLogementObsolete(
				{
					identifiantSource: annonceObsolete.identifiantSource,
					sourceUpdatedAt: annonceObsolete.sourceUpdatedAt,
				},
				annonceObsolete.id,
			));
	}

	private filtrerLesAnnoncesAMettreAJour(
		annoncesDeLogementDejaChargees: Array<UnJeune1Solution.AnnonceDeLogementReferencee>,
		annoncesDeLogementACharger: Array<UnJeune1Solution.AttributsAnnonceDeLogement>,
	): Array<UnJeune1Solution.AnnonceDeLogementAMettreAJour> {
		const result: Array<UnJeune1Solution.AnnonceDeLogementAMettreAJour> = [];

		for (const annonce of annoncesDeLogementACharger) {
			const annonceDejaChargee = annoncesDeLogementDejaChargees.find(current => current.identifiantSource == annonce.identifiantSource);

			if (annonceDejaChargee !== undefined && new Date(annonce.sourceUpdatedAt).getTime() > new Date(annonceDejaChargee.sourceUpdatedAt).getTime()) {
				result.push(new UnJeune1Solution.AnnonceDeLogementAMettreAJour(
					{ ...annonce }, annonceDejaChargee.id,
				));
			}
		}
		return result;
	}
}
