import { ExtraireJobteaser } from "@stages/extraction/application-service/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@stages/extraction/application-service/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@stages/extraction/application-service/extraire-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	extraireJobteaser: ExtraireJobteaser,
	extraireStagefrCompresse: ExtraireStagefrCompresse,
	extraireStagefrDecompresse: ExtraireStagefrDecompresse,
}
