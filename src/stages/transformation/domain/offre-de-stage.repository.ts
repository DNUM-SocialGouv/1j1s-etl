import { FluxTransformation } from "@stages/transformation/domain/flux";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";

export interface OffreDeStageRepository {
	recuperer<T>(flux: FluxTransformation): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeune1Solution.OffreDeStage>, flux: FluxTransformation): Promise<void>;
}
