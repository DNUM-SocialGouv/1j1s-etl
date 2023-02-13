import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";

export type UsecaseContainer = {
    immojeune: ChargerFluxImmojeune
    studapart: ChargerFluxStudapart
}
