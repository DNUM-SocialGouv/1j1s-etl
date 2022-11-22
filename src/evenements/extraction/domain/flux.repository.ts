import { FluxExtraction } from "@evenements/extraction/domain/flux";

export interface FluxRepository {
	enregistrer(cheminFichierIncluantNom: string, contenuFlux: string, flow: FluxExtraction, omettreExtension?: boolean): Promise<void>;
	recuperer(flow: FluxExtraction): Promise<string>;
}

