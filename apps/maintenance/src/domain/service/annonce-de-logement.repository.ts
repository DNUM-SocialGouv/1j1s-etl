import { AnnonceDeLogement } from "@maintenance/src/domain/model/annonce-de-logement";

export interface AnnonceDeLogementRepository {
	recuperer(flux: Array<string>): Promise<Array<AnnonceDeLogement>>;

	supprimer(annoncesDeLogement: Array<AnnonceDeLogement>): Promise<void>;
}
