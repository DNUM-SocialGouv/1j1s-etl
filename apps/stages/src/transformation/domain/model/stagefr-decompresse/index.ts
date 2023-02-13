import { OffreDeStage as _OffreDeStage } from "./offre-de-stage";

export namespace StagefrDecompresse {
    export type OffreDeStage = _OffreDeStage;

    export type Contenu = {
        jobs: {
            job: Array<OffreDeStage>
        }
    }
}
