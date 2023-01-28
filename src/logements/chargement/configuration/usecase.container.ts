import {
    ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { ChargerFluxImmojeune } from "@logements/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/chargement/application-service/charger-flux-studapart.usecase";
import { GatewayContainer } from "@logements/chargement/infrastructure/gateway";
import { UsecaseContainer } from "@logements/chargement/application-service";

export class UseCaseContainerFactory {
    public static create(gateways: GatewayContainer): UsecaseContainer {
        const chargerAnnoncesDeLogement = new ChargerAnnoncesDeLogementDomainService(gateways.annonceDeLogementRepository);

        return {
            immojeune: new ChargerFluxImmojeune(chargerAnnoncesDeLogement),
            studapart: new ChargerFluxStudapart(chargerAnnoncesDeLogement),
        };
    }
}
