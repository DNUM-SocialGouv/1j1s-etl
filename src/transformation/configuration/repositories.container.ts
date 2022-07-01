import { RepositoriesContainer } from "../infrastructure/gateway/repository";
import { OffreDeStageRepository } from "../domain/offre-de-stage/offre-de-stage.repository";

export function createRepositoriesContainer(): RepositoriesContainer {
	return {
		OffreDeStage: {} as OffreDeStageRepository
	};
}
