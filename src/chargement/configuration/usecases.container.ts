import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrCompresse } from "@chargement/usecase/charger-flux-stagefr-compresse.usecase";
import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@chargement/infrastructure/gateway";
import { UsecaseContainer } from "@chargement/usecase";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
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
