import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation as FluxImmojeune } from "@logements/src/transformation/domain/model/flux";
import { Immojeune } from "@logements/src/transformation/domain/model/immojeune";
import {
	AnnonceDeLogementRepository,
} from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import { Convertir } from "@logements/src/transformation/domain/service/immojeune/convertir.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class TransformerFluxImmojeune implements Usecase {
	constructor(
		private readonly repository: AnnonceDeLogementRepository,
		private readonly convertir: Convertir,
	) {
	}

	public async executer(flux: FluxImmojeune): Promise<void> {
		const contenu = await this.repository.recuperer<Array<Immojeune.AnnonceDeLogement>>(flux);
		const annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement> = [];

		contenu.forEach(value => {
			if(value.title === "") return;
			annoncesDeLogement.push(this.convertir.depuisImmojeune(value));
		});

		await this.repository.sauvegarder(annoncesDeLogement, flux);
	}
}
