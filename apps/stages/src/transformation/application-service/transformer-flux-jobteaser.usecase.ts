import { DateTime } from "luxon";

import { Usecase } from "@shared/src/application-service/usecase";
import { DateService } from "@shared/src/domain/service/date.service";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Jobteaser } from "@stages/src/transformation/domain/model/jobteaser";
import { Convertir } from "@stages/src/transformation/domain/service/jobteaser/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";

export class TransformerFluxJobteaser implements Usecase {
	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Convertir,
		private readonly dateService: DateService,
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenuDuFlux = await this.offreDeStageRepository.recuperer<Jobteaser.Contenu>(flux);

		const contenuFiltre: Array<Jobteaser.OffreDeStage> = contenuDuFlux.jobs.job.filter((job: Jobteaser.OffreDeStage) => {
			const unMoisPlusTot: DateTime = DateTime.fromJSDate(this.dateService.maintenant()).minus({ "month": 1 });
			return !job.start_date || DateTime.fromISO(job.start_date) >= unMoisPlusTot;
		});
		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage> = contenuFiltre.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, flux);
	}
}
