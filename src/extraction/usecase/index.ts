import { ExtraireJobteaser } from "@extraction/usecase/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@extraction/usecase/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "./extraire-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	extraireJobteaser: ExtraireJobteaser,
	extraireStagefrCompresse: ExtraireStagefrCompresse,
	extraireStagefrDecompresse: ExtraireStagefrDecompresse,
}
