import { DateService } from "@shared/date.service";
import { ExtraireFluxDomainService } from "@evenements/extraction/domain/service/extraire-flux.domain-service";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { GatewayContainer } from "@evenements/extraction/infrastucture/gateway";
import { UsecaseContainer } from "@evenements/extraction/application-service";

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
