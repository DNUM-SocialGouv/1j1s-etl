import { ExtraireImmojeune } from "@logements/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/extraction/application-service/extraire-studapart.usecase";

export type UsecaseContainer = {
	extraireImmojeune: ExtraireImmojeune,
	extraireStudapart: ExtraireStudapart,
}
