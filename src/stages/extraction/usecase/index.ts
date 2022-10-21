import { ExtraireJobteaser } from "@stages/extraction/usecase/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@stages/extraction/usecase/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";
import { ExtraireHelloWork } from "@stages/extraction/usecase/extraire-hello-work.usecase";

export type UsecaseContainer = {
	extraireJobteaser: ExtraireJobteaser,
	extraireHelloWork: ExtraireHelloWork,
	extraireStagefrCompresse: ExtraireStagefrCompresse,
	extraireStagefrDecompresse: ExtraireStagefrDecompresse,
}
