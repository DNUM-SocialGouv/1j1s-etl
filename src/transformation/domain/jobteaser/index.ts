import { Contenu as _Contenu, OffreDeStage as _OffreDeStage } from "@transformation/domain/jobteaser/offre-de-stage";
import { Domaine as _Domaine } from "@transformation/domain/jobteaser/domaine";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type OffreDeStage = _OffreDeStage;
}
