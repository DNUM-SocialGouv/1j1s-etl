import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { StagefrDecompresse } from "@transformation/domain/stagefr-decompresse";
import { Usecase } from "@shared/usecase";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";


export class TransformerFluxStagefrDecompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrDecompresse.Convertir
	) {
	}

	async executer(configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const contenu = await this.offreDeStageRepository.recuperer<StagefrDecompresse.Contenu>(configurationFlux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, configurationFlux);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrDecompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrDecompresse(offreDeStage));
	}
}
