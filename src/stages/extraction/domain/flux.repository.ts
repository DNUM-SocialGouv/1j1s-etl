import { Flux } from "@stages/extraction/domain/flux";

export interface FluxRepository {
	enregistrer(cheminFichierIncluantNom: string, contenuFlux: string, flow: Flux, omettreExtension?: boolean): Promise<void>;
	recuperer(flow: Flux): Promise<string>;
}

