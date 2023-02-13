import { Flux } from "@shared/src/flux";

export class FluxTransformation extends Flux {
	constructor(
		nom: string,
		public readonly dossierHistorisation: string,
		public readonly extensionFichierBrut: string,
		public readonly extensionFichierTransforme: string
	) {
		super(nom, extensionFichierBrut);
		this.dossierHistorisation = dossierHistorisation;
		this.extensionFichierBrut = extensionFichierBrut;
		this.extensionFichierTransforme = extensionFichierTransforme;
	}
}
