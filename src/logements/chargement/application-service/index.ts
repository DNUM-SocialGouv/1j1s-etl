import { ChargerFluxImmojeune } from "@logements/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/chargement/application-service/charger-flux-studapart.usecase";

export type UsecaseContainer = {
    immojeune: ChargerFluxImmojeune
    studapart: ChargerFluxStudapart
}
