import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";

export interface OffreDeStageRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeune1Solution.OffreDeStage>, flux: FluxTransformation): Promise<void>;
}
