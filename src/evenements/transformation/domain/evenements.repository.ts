import { FluxTransformation } from "@evenements/transformation/domain/flux";
import { UnjeuneUneSolution } from "@evenements/transformation/domain/1jeune1solution";

export interface EvenementsRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;
	sauvegarder(offresDeStage: Array<UnjeuneUneSolution.Evenement>, flux: FluxTransformation): Promise<void>;
}
