import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";

export class ChargerEvenenementsDomainService {
	constructor(private readonly evenementsRepository: UnJeuneUneSolution.EvenementsRepository) {
	}

	public async charger(nomFlux: string): Promise<void> {
		const evenementsExistants = await this.evenementsRepository.recupererEvenementsDejaCharges(nomFlux);
		const evenementsACharger = await this.evenementsRepository.recupererNouveauxEvenementsACharger(nomFlux);

		const evenementsAAjouter = this.getEvenementsAAjouter(evenementsACharger, evenementsExistants);

		const evenementsAMettreAjour = this.getEvenementsAMettreAjour(evenementsACharger, evenementsExistants);

		const evenementsASupprimer = this.getEvenementsASupprimer(evenementsExistants, evenementsACharger);

		const evenementsEnErreur = await this.evenementsRepository.chargerEtEnregistrerLesErreurs(evenementsAAjouter, evenementsAMettreAjour, evenementsASupprimer);

		await this.sauvegarderLesEvenements(evenementsEnErreur, nomFlux, evenementsAAjouter, evenementsAMettreAjour, evenementsASupprimer);
	}

	private async sauvegarderLesEvenements(evenementsEnErreur: Array<UnJeuneUneSolution.EvenementEnErreur>, nomFlux: string, evenementsAAjouter: Array<UnJeuneUneSolution.EvenementAAjouter>, evenementsAMettreAjour: Array<UnJeuneUneSolution.EvenementASupprimer>, evenementsASupprimer: Array<UnJeuneUneSolution.EvenementAMettreAJour>): Promise<void> {
		evenementsEnErreur.length > 0 && await this.evenementsRepository.sauvegarder(nomFlux, "ERROR", evenementsEnErreur);
		evenementsAAjouter.length > 0 && await this.evenementsRepository.sauvegarder(nomFlux, "CREATED", evenementsAAjouter);
		evenementsAMettreAjour.length > 0 && await this.evenementsRepository.sauvegarder(nomFlux, "UPDATED", evenementsAMettreAjour);
		evenementsASupprimer.length > 0 && await this.evenementsRepository.sauvegarder(nomFlux, "DELETED", evenementsASupprimer);
	}

	private getEvenementsAAjouter(evenementsACharger: Array<UnJeuneUneSolution.Evenement>, evenementsExistants: Array<UnJeuneUneSolution.EvenementDejaCharge>): Array<UnJeuneUneSolution.EvenementAAjouter> {
		return evenementsACharger.filter(evenementACharger =>
			!evenementsExistants.find(evenementExistant => evenementExistant.idSource === evenementACharger.idSource),
		);
	}

	private getEvenementsASupprimer(evenementsExistants: Array<UnJeuneUneSolution.EvenementDejaCharge>, evenementsACharger: Array<UnJeuneUneSolution.Evenement>): Array<UnJeuneUneSolution.EvenementAMettreAJour> {
		return evenementsExistants.filter(evenementExistant =>
			!evenementsACharger.find(evenementACharger => evenementACharger.idSource === evenementExistant.idSource),
		).map(evenementAMettreAJour => ({
			...evenementAMettreAJour,
			id: evenementsExistants.find(v => v.idSource === evenementAMettreAJour.idSource)!.id,
		}));
	}

	private getEvenementsAMettreAjour(evenementsACharger: Array<UnJeuneUneSolution.Evenement>, evenementsExistants: Array<UnJeuneUneSolution.EvenementDejaCharge>): Array<UnJeuneUneSolution.EvenementASupprimer> {
		return evenementsACharger.filter(evenementACharger =>
			evenementsExistants.find(evenementExistant =>
				evenementExistant.idSource === evenementACharger.idSource && !this.deepEqual(evenementExistant, evenementACharger),
			),
		).map(evenementAMettreAJour => ({
			...evenementAMettreAJour,
			id: evenementsExistants.find(v => v.idSource === evenementAMettreAJour.idSource)!.id,
		}));
	}

	private deepEqual(evenementExistant: UnJeuneUneSolution.EvenementDejaCharge, nouvelEvenement: UnJeuneUneSolution.Evenement): boolean {
		return evenementExistant.dateDebut === nouvelEvenement.dateDebut &&
			evenementExistant.dateFin === nouvelEvenement.dateFin &&
			evenementExistant.description === nouvelEvenement.description &&
			evenementExistant.lieuEvenement === nouvelEvenement.lieuEvenement &&
			evenementExistant.modaliteInscription === nouvelEvenement.modaliteInscription &&
			evenementExistant.online === nouvelEvenement.online &&
			evenementExistant.organismeOrganisateur === nouvelEvenement.organismeOrganisateur &&
			evenementExistant.titreEvenement === nouvelEvenement.titreEvenement &&
			evenementExistant.typeEvenement === nouvelEvenement.typeEvenement &&
			evenementExistant.source === nouvelEvenement.source;
	}
}
