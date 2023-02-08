import { AnnonceDeLogement } from "@logements/indexation/domain/model";

export interface AnnonceDeLogementRepository {
	indexerLesAnnonces(annoncesDeLogement: Array<AnnonceDeLogement.AIndexer>): Promise<void>;
	recupererLesAnnonces(source: string): Promise<Array<AnnonceDeLogement.Brute>>;
}
