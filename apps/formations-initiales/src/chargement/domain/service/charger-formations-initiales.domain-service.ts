import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import {
	FormationsInitialesChargementRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales-chargement.repository";

import { DateService } from "@shared/src/domain/service/date.service";

export class ChargerFormationsInitialesDomainService {
	static readonly INDENTATION_JSON: number = 2;
	static readonly REMPLACANT_JSON: null = null;

	constructor(private readonly formationsInitialesRepository: FormationsInitialesChargementRepository, private readonly dateService: DateService) {
	}

	async charger(flux: FluxChargement): Promise<void> {
		const formationsInitialesASauvegarder = await this.formationsInitialesRepository.recupererFormationsInitialesASauvegarder(flux.nom);
		const formationsInitialesASupprimer = await this.formationsInitialesRepository.recupererFormationsInitialesASupprimer(flux.nom);
		const formationInitialesASupprimerEnErreur = await this.formationsInitialesRepository.supprimer(formationsInitialesASupprimer, flux.nom);
		const formationsInitialesASauvegarderEnErreur = await this.formationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationsInitialesASauvegarder, flux.nom);

		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees(formationsInitialesASauvegarder, flux.nom);
		await this.formationsInitialesRepository.enregistrerHistoriqueDesFormationsEnErreur(formationsInitialesASauvegarderEnErreur, formationInitialesASupprimerEnErreur, flux.nom);
	}

	private async enregistrerLesResultatsDuChargementDansLeMinio(
		nomDuFlux: string,
		extensionDuFichierDeResultat: string,
		formationsInitialesASauvegarder: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>,
	): Promise<void> {
		const parametresDesFichiersDeResultat = {
			nomDuFlux,
			nomDuFichier: this.dateService.maintenant(),
			extensionDuFichier: extensionDuFichierDeResultat,
		};
		
		await this.enregistrerLeResultatDansLeMinio(false, formationsInitialesASauvegarder, parametresDesFichiersDeResultat);
		await this.enregistrerLeResultatDansLeMinio(true, formationsInitialesEnErreur, parametresDesFichiersDeResultat);
	}

	private async enregistrerLeResultatDansLeMinio(
		enErreur: boolean,
		formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder> | Array<UnJeuneUneSolution.FormationInitialeEnErreur>,
		parametres: { nomDuFlux: string, nomDuFichier: Date, extensionDuFichier: string },
	): Promise<void> {
		const contenu = this.versJSONLisible(formationsInitiales);
		const nomDuFichierDeResultat = this.creerLeNomDuFichierDeResultat(
			parametres.nomDuFlux,
			parametres.nomDuFichier,
			parametres.extensionDuFichier,
			enErreur
		);
	}

	private versJSONLisible(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder> | Array<UnJeuneUneSolution.FormationInitialeEnErreur>): string {
		return JSON.stringify(
			formationsInitiales,
			ChargerFormationsInitialesDomainService.REMPLACANT_JSON,
			ChargerFormationsInitialesDomainService.INDENTATION_JSON,
		);
	}

	private creerLeNomDuFichierDeResultat(
		nomDuFlux: string, nomDuFichier: Date, extensionDuFichier: string, enErreur: boolean,
	): string {
		return `${nomDuFlux}/${nomDuFichier.toISOString()}${enErreur ? "_ERROR" : ""}_${extensionDuFichier}`;
	}
}
