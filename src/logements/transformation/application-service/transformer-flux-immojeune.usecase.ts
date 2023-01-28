import { AnnonceDeLogementRepository } from "@logements/transformation/domain/service/annonce-de-logement.repository";
import { Convertir } from "@logements/transformation/domain/service/immojeune/convertir.domain-service";
import { FluxTransformation as FluxImmojeune } from "@logements/transformation/domain/model/flux";
import { Immojeune } from "@logements/transformation/domain/model/immojeune";
import { Usecase } from "@shared/usecase";

export class TransformerFluxImmojeune implements Usecase {
	constructor(
		private readonly repository: AnnonceDeLogementRepository,
		private readonly convertir: Convertir,
	) {
	}

	public async executer(flux: FluxImmojeune): Promise<void> {
		const contenu = await this.repository.recuperer<Array<Immojeune.AnnonceDeLogement>>(flux);

		const annoncesDeLogement = contenu.map(value => this.convertir.depuisImmojeune(value));

		await this.repository.sauvegarder(annoncesDeLogement, flux);
	}
}
