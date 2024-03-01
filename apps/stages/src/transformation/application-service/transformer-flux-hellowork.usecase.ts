import { Usecase } from "@shared/src/application-service/usecase";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Hellowork } from "@stages/src/transformation/domain/model/hellowork";
import { Convertir } from "@stages/src/transformation/domain/service/hellowork/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";

export class TransformerFluxHellowork implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Convertir,
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenuDuFlux = await this.offreDeStageRepository.recuperer<Hellowork.Contenu>(flux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.source.job.map((job: Hellowork.OffreDeStage) => this.convertirOffreDeStage.depuisHellowork(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}
}
