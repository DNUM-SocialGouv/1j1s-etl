import { Usecase } from "@shared/src/usecase";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Jobteaser } from "@stages/src/transformation/domain/model/jobteaser";
import { Convertir } from "@stages/src/transformation/domain/service/jobteaser/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";

export class TransformerFluxJobteaser implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Convertir,
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenuDuFlux = await this.offreDeStageRepository.recuperer<Jobteaser.Contenu>(flux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.jobs.job.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}
}
