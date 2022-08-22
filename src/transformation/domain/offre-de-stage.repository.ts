import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";

export interface OffreDeStageRepository {
	recuperer<T>(sourcefilePath: string): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeune1Solution.OffreDeStage>, configurationFlux: ConfigurationFlux): Promise<void>;
}
