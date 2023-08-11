import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import {
	FormationsInitialesRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales.repository";

import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";

export class FeatureFlippingFormationsInitialesRepository implements FormationsInitialesRepository {
	constructor(
		private loggerStrategy: LoggerStrategy,
	) {
	}

	public chargerLesFormationsInitiales(
		formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		flowName: string,
	): Promise<{
		formationsInitialesSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>,
	}> {
		this.loggerStrategy.get(flowName).debug(`Feature-flipping: Nombre de formations initiales à publier : ${formationsInitiales.length}`);
		return Promise.resolve({ formationsInitialesEnErreur: [], formationsInitialesSauvegardees: [] });
	}

	public async recupererFormationsInitialesASupprimer(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>> {
		this.loggerStrategy.get(flowName).info("Feature-flipping: Récupération des formations initiales à supprimer");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASupprimer>);
	}

	public enregistrerHistoriqueDesFormationsSauvegardees(formationsSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, flowName: string): Promise<void> {
		this.loggerStrategy.get(flowName).info(`Feature-flipping: Starting to save flow ${flowName}`);
		return Promise.resolve();
	}

	public enregistrerHistoriqueDesFormationsNonSauvegardees(formationsNonSauvegardees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, flowName: string): Promise<void> {
		this.loggerStrategy.get(flowName).info(`Feature-flipping: Starting to save flow ${flowName}`);
		return Promise.resolve();
	}

	public enregistrerHistoriqueDesFormationsNonSupprimees(formationsNonSupprimees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, flowName: string): Promise<void> {
		this.loggerStrategy.get(flowName).info(`Feature-flipping: Starting to save flow ${flowName}`);
		return Promise.resolve();
	}

	public async supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).debug(`Feature-flipping: Nombre de formations initiales à supprimer : ${formationsInitiales.length}`);
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeEnErreur>);
	}

	public async recupererFormationsInitialesASauvegarder(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>> {
		this.loggerStrategy.get(flowName).info("Feature-flipping: Récupération des formations initiales à sauvegarder");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASauvegarder>);
	}
}
