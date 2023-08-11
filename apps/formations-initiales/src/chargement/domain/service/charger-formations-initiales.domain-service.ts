import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import {
	FormationsInitialesRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales.repository";

export class ChargerFormationsInitialesDomainService {
	constructor(private readonly formationsInitialesRepository: FormationsInitialesRepository) {
	}

	async charger(flux: FluxChargement): Promise<void> {
		const formationsInitialesASauvegarder = await this.formationsInitialesRepository.recupererFormationsInitialesASauvegarder(flux.nom);
		const formationsInitialesASupprimer = await this.formationsInitialesRepository.recupererFormationsInitialesASupprimer(flux.nom);
		const { formationsInitialesSauvegardees, formationsInitialesEnErreur : formationsInitialesNonSauvegardees } = await this.formationsInitialesRepository.chargerLesFormationsInitiales(formationsInitialesASauvegarder, flux.nom);

		const formationsInitialesASupprimerSansCellesNonSauvegardees = formationsInitialesASupprimer.filter(this.isNotInFormationsInitialesEnErreur(formationsInitialesNonSauvegardees));
		const formationInitialesNonSupprimees = await this.formationsInitialesRepository.supprimer(formationsInitialesASupprimerSansCellesNonSauvegardees, flux.nom);

		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees(formationsInitialesSauvegardees, flux.nom);
		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSauvegardees(formationsInitialesNonSauvegardees, flux.nom);
		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSupprimees(formationInitialesNonSupprimees, flux.nom);
	}

	private isNotInFormationsInitialesEnErreur(formationsInitialesNonSauvegardees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>): (formationASupprimer: UnJeuneUneSolution.FormationInitialeASupprimer) => boolean {
		return formationASupprimer => !formationsInitialesNonSauvegardees.find(enErreur => formationASupprimer.identifiant === enErreur.formationInitiale.identifiant);
	}
}
