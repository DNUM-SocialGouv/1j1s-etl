import { AnnonceDeLogementRepository } from "@logements/transformation/domain/annonce-de-logement.repository";
import { FluxTransformation as FluxImmojeune } from "@logements/transformation/domain/flux";
import { Usecase } from "@shared/usecase";
import { Studapart } from "@logements/transformation/domain/studapart";

export class TransformerFluxStudapartUseCase implements Usecase {
	constructor(
		private readonly repository: AnnonceDeLogementRepository,
		private readonly convertir: Studapart.Convertir,
	) {
	}

	public async executer(flux: FluxImmojeune): Promise<void> {
		const contenu = await this.repository.recuperer<Studapart.Contenu>(flux);

		const annoncesDeLogement = contenu.unjeuneunesolution.item.map(studapartLogement => this.convertir.depuisStudapartVersUnJeuneUneSolution(studapartLogement));

		await this.repository.sauvegarder(annoncesDeLogement, flux);
	}
}
