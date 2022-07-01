import { OffreDeStage } from "./offre-de-stage";

export interface OffreDeStageRepository {
	createOffresDeStages(offresDeStages: Array<OffreDeStage>): Promise<void>;
}
