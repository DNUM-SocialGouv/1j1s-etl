import { AnnonceDeLogementRepository } from "@logements/transformation/domain/service/annonce-de-logement.repository";
import { Convertir } from "@logements/transformation/domain/service/studapart/convertir.domain-service";
import { FluxTransformation as FluxImmojeune } from "@logements/transformation/domain/model/flux";
import { Studapart } from "@logements/transformation/domain/model/studapart";
import { Usecase } from "@shared/usecase";

export class TransformerFluxStudapartUseCase implements Usecase {
	constructor(
		private readonly repository: AnnonceDeLogementRepository,
		private readonly convertir: Convertir,
	) {
	}

	public async executer(flux: FluxImmojeune): Promise<void> {
		const contenu = await this.repository.recuperer<Studapart.Contenu>(flux);

		const annoncesDeLogement = contenu.unjeuneunesolution.item.map(studapartLogement => this.convertir.depuisStudapartVersUnJeuneUneSolution(studapartLogement));

		await this.repository.sauvegarder(annoncesDeLogement, flux);
	}
}
