import { DateService } from "@shared/src/date.service";
import { ExtraireFluxDomainService } from "@evenements/src/extraction/domain/service/extraire-flux.domain-service";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { GatewayContainer } from "@evenements/src/extraction/infrastructure/gateway";
import { UsecaseContainer } from "@evenements/src/extraction/application-service";

export class UsecaseContainerFactory {
    public static create(gateways: GatewayContainer): UsecaseContainer {
        const dateService = new DateService();

        const extraireFluxDomainService = new ExtraireFluxDomainService(
            gateways.repositories.flowRepository,
            dateService
        );

        return {
            extraireEvenementsTousMobilises: new ExtraireFluxEvenementTousMobilises(extraireFluxDomainService),
        };
    }
}
