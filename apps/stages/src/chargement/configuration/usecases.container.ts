import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrCompresse } from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import { ChargerFluxStagefrDecompresse } from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";
import { DateService } from "@shared/src/date.service";
import { GatewayContainer } from "@stages/src/chargement/infrastructure/gateway";
import { UsecaseContainer } from "@stages/src/chargement/application-service";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const chargerOffresDeStageDomainService = new ChargerOffresDeStageDomainService(
			gateways.offreDeStageRepository,
			dateService
		);

		return {
			chargerFluxJobteaser: new ChargerFluxJobteaser(chargerOffresDeStageDomainService),
			chargerFluxStagefrCompresse: new ChargerFluxStagefrCompresse(chargerOffresDeStageDomainService),
			chargerFluxStagefrDecompresse: new ChargerFluxStagefrDecompresse(chargerOffresDeStageDomainService),
		};
	}
}
