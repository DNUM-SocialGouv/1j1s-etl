import { FluxExtraction } from "@stages/extraction/domain/model/flux";

export interface FluxRepository {
	enregistrer(cheminFichierIncluantNom: string, contenuFlux: string, flow: FluxExtraction, omettreExtension?: boolean): Promise<void>;
	recuperer(flow: FluxExtraction): Promise<string>;
}

