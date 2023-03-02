import { Flux } from "@shared/src/domain/model/flux";

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
