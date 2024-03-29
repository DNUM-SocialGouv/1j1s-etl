import { Flux } from "@shared/src/domain/model/flux";

export class FluxExtraction extends Flux {
	constructor(
		nomDuFlux: string,
		extension: string,
		public readonly dossierHistorisation: string,
		public readonly url: string
	) {
		super(nomDuFlux, extension);
		this.dossierHistorisation = dossierHistorisation;
		this.url = url;
	}
}
