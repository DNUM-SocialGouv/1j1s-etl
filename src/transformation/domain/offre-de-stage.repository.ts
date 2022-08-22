import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export interface OffreDeStageRepository {
	recuperer<T>(configurationFlux: ConfigurationFlux): Promise<T>;
	sauvegarder(offresDeStage: Array<UnJeune1Solution.OffreDeStage>, configurationFlux: ConfigurationFlux): Promise<void>;
}
