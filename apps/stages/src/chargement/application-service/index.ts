import { ChargerFluxJobteaser } from "./charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrCompresse } from "./charger-flux-stagefr-compresse.usecase";
import { ChargerFluxStagefrDecompresse } from "./charger-flux-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	chargerFluxJobteaser: ChargerFluxJobteaser,
	chargerFluxStagefrCompresse: ChargerFluxStagefrCompresse,
	chargerFluxStagefrDecompresse: ChargerFluxStagefrDecompresse
}
