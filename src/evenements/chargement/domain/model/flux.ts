import { Flux } from "@shared/flux";

export class FluxChargement extends Flux {
	constructor(
		nom: string,
		public readonly dossierHistorisation: string,
		public readonly extension: string,
	) {
		super(nom, extension);
		this.dossierHistorisation = dossierHistorisation;
		this.extension = extension;
	}
}
