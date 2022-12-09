import { FluxTransformation } from "@logements/transformation/domain/flux";
import { UnJeune1Solution } from "@logements/transformation/domain/1jeune1solution";

export interface AnnonceDeLogementRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;

	sauvegarder(annonceDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>, flux: FluxTransformation): Promise<void>;
}
