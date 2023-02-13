import { Convertir } from "@evenements/src/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";
import { TousMobilises } from "@evenements/src/transformation/domain/model/tous-mobilises";
import { Usecase } from "@shared/src/usecase";

export class TransformerFluxTousMobilises implements Usecase {
	constructor(
		private readonly evenementsRepository: EvenementsRepository,
		private readonly convertir: Convertir,
	) {
	}

	public async executer(flux: FluxTransformation): Promise<void> {
		const contenuDuFlux = await this.evenementsRepository.recuperer<Array<TousMobilises.Contenu>>(flux);

		await this.evenementsRepository.sauvegarder(this.convertir.depuisTousMobilises(contenuDuFlux), flux);
	}
}
