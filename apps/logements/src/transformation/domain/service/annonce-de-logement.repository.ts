import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";

export interface AnnonceDeLogementRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;

	sauvegarder(annonceDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>, flux: FluxTransformation): Promise<void>;
}
