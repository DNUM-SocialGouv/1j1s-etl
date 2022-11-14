import { Flux } from "@stages/transformation/domain/flux";
import { Jobteaser } from "@stages/transformation/domain/jobteaser";
import { OffreDeStageRepository } from "@stages/transformation/domain/offre-de-stage.repository";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Jobteaser.Convertir,
	) {
	}

	public async executer<T>(flux: Readonly<Flux>): Promise<void | T> {
		const contenuDuFlux = await this.offreDeStageRepository.recuperer<Jobteaser.Contenu>(flux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.jobs.job.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}
}
