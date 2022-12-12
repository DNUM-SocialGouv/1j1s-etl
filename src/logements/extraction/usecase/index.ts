import { ExtraireImmojeune } from "@logements/extraction/usecase/extraire-immojeune.usecase";
import { ExtraireStudapartUseCase } from "@logements/extraction/usecase/extraire-studapart.usecase";

export type UsecaseContainer = {
	extraireImmojeune: ExtraireImmojeune,
	extraireStudapart: ExtraireStudapartUseCase,
}
