import { ChargerFluxJobteaser } from "@stages/chargement/application-service/charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrCompresse } from "@stages/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import { ChargerFluxStagefrDecompresse } from "@stages/chargement/application-service/charger-flux-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	chargerFluxJobteaser: ChargerFluxJobteaser,
	chargerFluxStagefrCompresse: ChargerFluxStagefrCompresse,
	chargerFluxStagefrDecompresse: ChargerFluxStagefrDecompresse
}
