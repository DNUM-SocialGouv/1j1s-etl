import { Convertir } from "@evenements/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { EvenementsRepository } from "@evenements/transformation/domain/service/evenements.repository";
import { FluxTransformation } from "@evenements/transformation/domain/model/flux";
import { TousMobilises } from "@evenements/transformation/domain/model/tous-mobilises";
import { Usecase } from "@shared/usecase";

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
