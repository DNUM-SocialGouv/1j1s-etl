export interface FluxClient {
	recuperer(url: string): Promise<string>;
}

export class LectureFluxErreur extends Error {
	constructor(urlDuFlux: string) {
		super(`Le flux à l'adresse ${urlDuFlux} n'a pas été extrait car une erreur de lecture est survenue`);
	}
}
