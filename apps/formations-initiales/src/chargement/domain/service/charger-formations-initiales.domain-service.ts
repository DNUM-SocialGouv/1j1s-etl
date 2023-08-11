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
		const formationInitialesASupprimerEnErreur = await this.formationsInitialesRepository.supprimer(formationsInitialesASupprimer, flux.nom);
		const { formationsInitialesSauvegardees, formationsInitialesEnErreur } = await this.formationsInitialesRepository.chargerLesFormationsInitiales(formationsInitialesASauvegarder, flux.nom);

		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees(formationsInitialesSauvegardees, flux.nom);
		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSauvegardees(formationsInitialesEnErreur, flux.nom);
		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSupprimees(formationInitialesASupprimerEnErreur, flux.nom);
	}
}
