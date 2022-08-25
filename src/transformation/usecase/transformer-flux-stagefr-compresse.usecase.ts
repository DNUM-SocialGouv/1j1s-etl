import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";
import { StagefrCompresse } from "@transformation/domain/stagefr-compresse";


export class TransformerFluxStagefrCompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrCompresse.Convertir
	) {
	}

	async executer(configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const contenu = await this.offreDeStageRepository.recuperer<StagefrCompresse.Contenu>(configurationFlux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, configurationFlux);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrCompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrCompresse(offreDeStage));
	}
}
