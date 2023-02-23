import { Usecase } from "@shared/src/usecase";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { StagefrDecompresse } from "@stages/src/transformation/domain/model/stagefr-decompresse";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { Convertir } from "@stages/src/transformation/domain/service/stagefr-decompresse/convertir.domain-service";

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
