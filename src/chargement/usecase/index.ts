import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	chargerFluxJobteaser: ChargerFluxJobteaser,
	chargerFluxStagefrDecompresse: ChargerFluxStagefrDecompresse
}
