import { OffreDeStage } from "@maintenance/src/domain/model/offre-de-stage";

export class OffreDeStageFixtureBuilder {
	public static build(id?: string): OffreDeStage {
		return { id: id || "123" };
	}
}
