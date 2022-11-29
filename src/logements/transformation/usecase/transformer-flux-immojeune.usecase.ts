import { AnnonceDeLogementRepository } from "@logements/transformation/domain/annonce-de-logement.repository";
import { FluxTransformation as FluxImmojeune } from "@logements/transformation/domain/flux";
import { Usecase } from "@shared/usecase";
import { Immojeune } from "@logements/transformation/domain/immojeune";

export class TransformerFluxImmojeune implements Usecase {
	constructor(
		private readonly repository: AnnonceDeLogementRepository,
		private readonly convertir: Immojeune.Convertir,
	) {
	}

	public async executer(flux: FluxImmojeune): Promise<void> {
		const contenu = await this.repository.recuperer<Array<Immojeune.AnnonceDeLogement>>(flux);

		const annoncesDeLogement = contenu.map(value => this.convertir.depuisImmojeune(value));

		await this.repository.sauvegarder(annoncesDeLogement, flux);
	}
}
