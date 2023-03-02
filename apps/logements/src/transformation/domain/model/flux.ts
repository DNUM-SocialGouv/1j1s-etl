import { Flux } from "@shared/src/domain/model/flux";

export class FluxTransformation extends Flux {
	constructor(
		nom: string,
		public readonly dossierHistorisation: string,
		public readonly extensionFichierBrut: string,
		public readonly extensionFichierTransforme: string,
	) {
		super(nom, extensionFichierBrut);
		this.dossierHistorisation = dossierHistorisation;
		this.extensionFichierBrut = extensionFichierBrut;
		this.extensionFichierTransforme = extensionFichierTransforme;
	}
}
