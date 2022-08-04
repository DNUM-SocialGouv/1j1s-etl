import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class ChargerFluxJobteaser implements Usecase {
	constructor(private readonly offreDeStageRepository: UnJeune1Solution.OffreDeStageRepository) {
	}

	async executer(nomDuFlux: string): Promise<void> {
		const offresDeStages = await this.offreDeStageRepository.recuperer(nomDuFlux);

		const offresDeStagesAvecEmployeur = this.filtrerLesOffresDeStagesSansEmployeur(offresDeStages);

		return this.offreDeStageRepository.charger(offresDeStagesAvecEmployeur);
	}

	private filtrerLesOffresDeStagesSansEmployeur(offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Array<UnJeune1Solution.OffreDeStage> {
		return offresDeStages.filter((offreDeStage) => offreDeStage.employeur);
	}
}
