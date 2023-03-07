import { OffreDeStage } from "@maintenance/src/domain/model/offre-de-stage";

export interface OffreDeStageRepository {
	recuperer(flux: Array<string>): Promise<Array<OffreDeStage>>;

	supprimer(offresDeStage: Array<OffreDeStage>): Promise<void>;
}
