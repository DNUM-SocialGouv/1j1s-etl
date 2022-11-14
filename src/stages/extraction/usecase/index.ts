import { ExtraireJobteaser } from "@stages/extraction/usecase/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@stages/extraction/usecase/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	extraireJobteaser: ExtraireJobteaser,
	extraireStagefrCompresse: ExtraireStagefrCompresse,
	extraireStagefrDecompresse: ExtraireStagefrDecompresse,
}
