import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import {
	FormationInitialeStrapiExtrait,
} from '@formations-initiales/src/chargement/infrastructure/gateway/client/strapi-formations-initiales.httpClient';

export interface HttpClient {
	delete(formationInitiale: UnJeuneUneSolution.FormationInitialeASupprimer): Promise<void>;
	getAll(): Promise<Array<FormationInitialeStrapiExtrait>>;
	post(formationInitiale: UnJeuneUneSolution.FormationInitialeASauvegarder): Promise<void>;
}

