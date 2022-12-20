import { FluxTransformation } from "@evenements/transformation/domain/flux";
import { Usecase } from "@shared/usecase";
import { EvenementsRepository } from "@evenements/transformation/domain/evenements.repository";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import Convertir = TousMobilises.Convertir;

export class TransformerFluxTousMobilisesUseCase implements Usecase {
	constructor(
		private readonly evenementsRepository: EvenementsRepository,
		private readonly convertir: Convertir,
	) {
	}

	public async executer<T>(flux: FluxTransformation): Promise<void | T> {
		const contenuDuFlux = await this.evenementsRepository.recuperer<Array<TousMobilises.Contenu>>(flux);

		await this.evenementsRepository.sauvegarder(this.convertir.depuisTousMobilises(contenuDuFlux), flux);
	}
}
