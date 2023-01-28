import { Domaine as _Domaine } from "@stages/transformation/domain/model/jobteaser/domaine";
import {
	Contenu as _Contenu,
	Duree as _Duree,
	Employeur as _Employeur,
	Localisation as _Localisation,
	OffreDeStage as _OffreDeStage,
} from "@stages/transformation/domain/model/jobteaser/offre-de-stage";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type Duree = _Duree;
	export type Employeur = _Employeur;
	export type Localisation = _Localisation;
	export type OffreDeStage = _OffreDeStage;
}
