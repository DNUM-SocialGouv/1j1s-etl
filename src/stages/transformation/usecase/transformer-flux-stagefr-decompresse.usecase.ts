import { FluxTransformation } from "@stages/transformation/domain/flux";
import { OffreDeStageRepository } from "@stages/transformation/domain/offre-de-stage.repository";
import { StagefrDecompresse } from "@stages/transformation/domain/stagefr-decompresse";
import { Usecase } from "@shared/usecase";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";


export class TransformerFluxStagefrDecompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrDecompresse.Convertir
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenu = await this.offreDeStageRepository.recuperer<StagefrDecompresse.Contenu>(flux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrDecompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrDecompresse(offreDeStage));
	}
}