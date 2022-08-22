import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Jobteaser.Convertir,
	) {
	}

	async executer<T>(configurationFlux: Readonly<ConfigurationFlux>): Promise<void | T> {
		const contenuDuFlux = await this.offreDeStageRepository.recuperer<Jobteaser.Contenu>(configurationFlux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.jobs.job.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, configurationFlux);
	}
}
