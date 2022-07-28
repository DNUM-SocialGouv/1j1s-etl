import { Domaine as _Domaine } from "@transformation/domain/1jeune1solution/domaine";
import { OffreDeStage as _OffreDeStage, Source as _Source } from "@transformation/domain/1jeune1solution/offre-de-stage";

export namespace UnJeune1Solution {
	export import Domaine = _Domaine;
	export type OffreDeStage = _OffreDeStage;
	export import Source = _Source;
}
