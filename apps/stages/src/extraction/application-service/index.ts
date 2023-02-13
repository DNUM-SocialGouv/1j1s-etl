import { ExtraireJobteaser } from "./extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "./extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "./extraire-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	extraireJobteaser: ExtraireJobteaser,
	extraireStagefrCompresse: ExtraireStagefrCompresse,
	extraireStagefrDecompresse: ExtraireStagefrDecompresse,
}
