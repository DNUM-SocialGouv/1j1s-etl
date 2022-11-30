export class EcritureFluxErreur extends Error {
	constructor(nomFlux: string) {
		super(`Le flux ${nomFlux} n'a pas été extrait car une erreur d'écriture est survenue`);
	}
}

export class LectureFluxErreur extends Error {
	constructor(urlDuFlux: string, statusCode?: string) {
		super(`Le flux à l'adresse ${urlDuFlux} n'a pas été extrait car une erreur de lecture est survenue`);
	}
}

export class RecupererContenuErreur extends Error {
	constructor() {
		super("Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu");
	}
}

export class RecupererOffresExistantesErreur extends Error {
	constructor() {
		super("Une erreur est survenue lors de la récupération des offres existantes");
	}
}

export class AuthentificationErreur extends Error {
	constructor(nomFlux: string) {
		super(`Une erreur est survenue lors de l'authentification pour le flux ${nomFlux}`);
	}
}
