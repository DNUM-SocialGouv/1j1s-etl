import { UnJeuneUneSolution } from "@evenements/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";

export interface EvenementsRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeuneUneSolution.Evenement>, flux: FluxTransformation): Promise<void>;
}
