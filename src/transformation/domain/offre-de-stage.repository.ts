export interface OffreDeStageRepository {
	enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void>;
	recuperer<T>(sourcefilePath: string): Promise<T>;
}
