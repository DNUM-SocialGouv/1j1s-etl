import { AnnonceDeLogementRepository } from "@logements/chargement/domain/service/annonce-de-logement.repository";
import { FluxChargement } from "@logements/chargement/domain/model/flux";
import { UnJeune1Solution } from "@logements/chargement/domain/model/1jeune1solution";

export class ChargerAnnoncesDeLogementDomainService {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async charger(flux: FluxChargement): Promise<void> {
		const annoncesDeLogementACharger = await this.annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees(flux);
		const annoncesDeLogementAChargerFiltrees = annoncesDeLogementACharger.filter((annonce) => this.isValidLocalisation(annonce));
		const annoncesDeLogementDejaChargees = await this.annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees(flux);

		const annoncesAcharger = [
			...this.filtrerLesNouvellesAnnoncesACharger(annoncesDeLogementDejaChargees, annoncesDeLogementAChargerFiltrees),
			...this.filtrerLesAnnoncesASupprimer(annoncesDeLogementDejaChargees, annoncesDeLogementAChargerFiltrees),
			...this.filtrerLesAnnoncesAMettreAJour(annoncesDeLogementDejaChargees, annoncesDeLogementAChargerFiltrees),
		];
		const annoncesEnErreur = await this.annonceDeLogementRepository.charger(annoncesAcharger, flux.nom);

		await this.annonceDeLogementRepository.preparerLeSuivi(
			[
				...annoncesAcharger,
				...annoncesEnErreur,
			],
			flux
		);
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

	private isValidLocalisation(annonce: UnJeune1Solution.AnnonceDeLogement ): boolean  {
		const localisation = annonce.localisation;
		return !!localisation && Object.values(localisation)
			.some((value: string | number) => {
				const hasStringValue = (typeof value === "string" && value !== "");
				const hasNumberValue = (typeof value === "number" && value !== 0);
				return hasStringValue || hasNumberValue;
			});
	}
}
