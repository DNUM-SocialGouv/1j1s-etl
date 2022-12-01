import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";
import Evenement = UnjeuneUneSolutionChargement.Evenement;
import EvenementDejaCharge = UnjeuneUneSolutionChargement.EvenementDejaCharge;
import EvenementASupprimer = UnjeuneUneSolutionChargement.EvenementASupprimer;

export class ChargerEvenenementsDomainService {
	constructor(
		private readonly evenementsRepository: UnjeuneUneSolutionChargement.EvenementsRepository,
	) {
	}

	public async charger(nomFlux: string): Promise<void> {
		const evenementsExistants = await this.evenementsRepository.recupererEvenementsDejaCharges(nomFlux);
		const evenementsACharger = await this.evenementsRepository.recupererNouveauxEvenementsACharger(nomFlux);

		const evenementsAAjouter = evenementsACharger.filter(evenementACharger =>
			!evenementsExistants.find(evenementExistant => evenementExistant.idSource === evenementACharger.idSource)
		);

		const evenementsAMettreAjour = evenementsACharger.filter(evenementACharger =>
			evenementsExistants.find(evenementExistant =>
				evenementExistant.idSource === evenementACharger.idSource && !this.deepEqual(evenementExistant, evenementACharger)
			)
		).map(evenementAMettreAJour => ({
			...evenementAMettreAJour,
			id: evenementsExistants.find(v => v.idSource === evenementAMettreAJour.idSource)!.id,
		}));

		const evenementsASupprimer: EvenementASupprimer[] = evenementsExistants.filter(evenementExistant =>
			!evenementsACharger.find(evenementACharger => evenementACharger.idSource === evenementExistant.idSource)
		).map(evenementAMettreAJour => ({
			...evenementAMettreAJour,
			id: evenementsExistants.find(v => v.idSource === evenementAMettreAJour.idSource)!.id,
		}));

		// TODO : gérer la sauvegarde des évenements en erreur
		await this.evenementsRepository.chargerEtEnregistrerLesErreurs(evenementsAAjouter, evenementsAMettreAjour, evenementsASupprimer);

		return Promise.resolve();
	}

	private deepEqual(evenementExistant: EvenementDejaCharge, nouvelEvenement: Evenement): boolean {
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
