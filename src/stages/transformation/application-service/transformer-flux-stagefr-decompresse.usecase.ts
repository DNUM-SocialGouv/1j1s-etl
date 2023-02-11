import { Convertir } from "@stages/transformation/domain/service/stagefr-decompresse/convertir.domain-service";
import { FluxTransformation } from "@stages/transformation/domain/model/flux";
import { OffreDeStageRepository } from "@stages/transformation/domain/service/offre-de-stage.repository";
import { StagefrDecompresse } from "@stages/transformation/domain/model/stagefr-decompresse";
import { Usecase } from "@shared/usecase";
import { UnJeune1Solution } from "@stages/transformation/domain/model/1jeune1solution";

export class TransformerFluxStagefrDecompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: Convertir
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
