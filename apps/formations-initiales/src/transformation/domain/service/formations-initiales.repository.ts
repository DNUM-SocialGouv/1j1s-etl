import { UnJeuneUneSolution } from "@formations-initiales/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";

export interface FormationsInitialesRepository {
  recuperer<T>(flux: FluxTransformation): Promise<T>;
  sauvegarder(formationInitiales: Array<UnJeuneUneSolution.FormationInitiale>, flux: FluxTransformation): Promise<void>;
}
