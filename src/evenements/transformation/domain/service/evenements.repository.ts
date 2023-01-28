import { FluxTransformation } from "@evenements/transformation/domain/model/flux";
import { UnJeuneUneSolution } from "@evenements/transformation/domain/model/1jeune1solution";

export interface EvenementsRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeuneUneSolution.Evenement>, flux: FluxTransformation): Promise<void>;
}
