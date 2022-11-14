import { Flux } from "@stages/extraction/domain/flux";

export interface FluxRepository {
	enregistrer(cheminFichierIncluantNom: string, contenuFlux: string, flow: Flux, omettreExtension?: boolean): Promise<void>;
	recuperer(flow: Flux): Promise<string>;
}

export class EcritureFluxErreur extends Error {
	constructor(nomFlux: string) {
		super(`Le flux ${nomFlux} n'a pas été extrait car une erreur d'écriture est survenue`);
	}
}

export class LectureFluxErreur extends Error {
	constructor(urlDuFlux: string) {
		super(`Le flux à l'adresse ${urlDuFlux} n'a pas été extrait car une erreur de lecture est survenue`);
	}
}
