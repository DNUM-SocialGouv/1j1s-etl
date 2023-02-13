import {
  ChargerEvenenementsDomainService,
} from "@evenements/src/chargement/domain/service/charger-evenements.domain-service";
import { Usecase } from "@shared/src/usecase";

export class ChargerFluxTousMobilises implements Usecase {
  constructor(private readonly domain: ChargerEvenenementsDomainService) {}

  async executer(nomFlux: string): Promise<void> {
    return this.domain.charger(nomFlux);
  }

}
