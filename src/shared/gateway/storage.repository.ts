export interface StorageRepository {
	enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void>;
	recupererContenu<T>(sourcefilePath: string): Promise<T>;
}

export class EcritureFluxErreur extends Error {
	constructor(nomFlux: string) {
		super(`Le flux ${nomFlux} n'a pas été extrait car une erreur d'écriture est survenue`);
	}
}

export class RecupererContenuErreur extends Error {
	constructor() {
		super("Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu");
	}
}
