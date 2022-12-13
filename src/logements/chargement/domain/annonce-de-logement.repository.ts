import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { FluxLogement } from "@logements/chargement/domain/flux";

export interface AnnonceDeLogementRepository {
	charger(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>, nomDuflux: string): Promise<Array<UnJeune1Solution.AnnonceDeLogementEnErreur>>;

	recupererAnnoncesDeLogementNonReferencees(flux: FluxLogement): Promise<Array<UnJeune1Solution.AnnonceDeLogement>>;

	recupererAnnoncesDeLogementReferencees(flux: FluxLogement): Promise<Array<UnJeune1Solution.AnnonceDeLogementReferencee>>;

	preparerLeSuivi(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>, flux: FluxLogement): Promise<void>;
}

