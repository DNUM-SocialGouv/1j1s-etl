import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";

export type UsecaseContainer = {
	extraireImmojeune: ExtraireImmojeune,
	extraireStudapart: ExtraireStudapart,
}
