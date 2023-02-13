import { Convertir } from "@stages/src/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { StagefrCompresse } from "@stages/src/transformation/domain/model/stagefr-compresse";
import { Usecase } from "@shared/src/usecase";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";

export class TransformerFluxStagefrCompresse implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: Convertir
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenu = await this.offreDeStageRepository.recuperer<StagefrCompresse.Contenu>(flux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrCompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrCompresse(offreDeStage));
	}
}
