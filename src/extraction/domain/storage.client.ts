export interface StorageClient {
	enregistrer(
		cheminFichierIncluantNom: string,
		contenuFichier: string,
		nomFlux: string,
		omettreExtension?: boolean,
	): Promise<void>;
}

export class EcritureFluxErreur extends Error {
	constructor(nomFlux: string) {
		super(`Le flux ${nomFlux} n'a pas été extrait car une erreur d'écriture est survenue`);
	}
}
