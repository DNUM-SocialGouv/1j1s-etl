import { Flux } from "@transformation/domain/flux";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { StagefrCompresse } from "@transformation/domain/stagefr-compresse";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";


export class TransformerFluxStagefrCompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrCompresse.Convertir
	) {
	}

	async executer(flux: Readonly<Flux>): Promise<void> {
		const contenu = await this.offreDeStageRepository.recuperer<StagefrCompresse.Contenu>(flux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrCompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrCompresse(offreDeStage));
	}
}
