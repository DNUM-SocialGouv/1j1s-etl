import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { FluxChargement } from "@logements/chargement/domain/flux";

export interface AnnonceDeLogementRepository {
	charger(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>, nomDuflux: string): Promise<Array<UnJeune1Solution.AnnonceDeLogementEnErreur>>;

	recupererAnnoncesDeLogementNonReferencees(flux: FluxChargement): Promise<Array<UnJeune1Solution.AnnonceDeLogement>>;

	recupererAnnoncesDeLogementReferencees(flux: FluxChargement): Promise<Array<UnJeune1Solution.AnnonceDeLogementReferencee>>;

	preparerLeSuivi(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>, flux: FluxChargement): Promise<void>;
}

