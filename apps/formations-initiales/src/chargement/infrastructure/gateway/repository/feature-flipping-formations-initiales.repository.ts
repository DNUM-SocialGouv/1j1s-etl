import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import {
	FormationsInitialesChargementRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales-chargement.repository";

import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";

export class FeatureFlippingFormationsInitialesRepository implements FormationsInitialesChargementRepository {
	constructor(
		private loggerStrategy: LoggerStrategy,
	) {}

	public chargerLesFormationsInitialesDansLeCMS(
		formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		flowName: string,
	): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).debug(`Nombre de formations initiales à publier : ${formationsInitiales.length}`);
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeEnErreur>);
	}

	public async recupererFormationsInitialesASupprimer(source: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>> {
		this.loggerStrategy.get(source).info("Récupération des formations initiales à supprimer");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASupprimer>);
	}

	public async enregistrerDansLeMinio(): Promise<void> {
		return Promise.resolve();
	}

	public async supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).debug(`Nombre de formations initiales à supprimer : ${formationsInitiales.length}`);
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeEnErreur>);
	}

	public async recupererFormationsInitialesASauvegarder(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>> {
		this.loggerStrategy.get(flowName).info("Récupération des formations initiales à sauvegarder");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASauvegarder>);
	}
}
