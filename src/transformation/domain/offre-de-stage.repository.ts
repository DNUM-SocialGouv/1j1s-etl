import { Flux } from "@transformation/domain/flux";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export interface OffreDeStageRepository {
	recuperer<T>(flux: Flux): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeune1Solution.OffreDeStage>, flux: Flux): Promise<void>;
}
