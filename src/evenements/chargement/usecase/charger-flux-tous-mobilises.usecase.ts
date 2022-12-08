import { Usecase } from "@shared/usecase";
import {
  ChargerEvenenementsDomainService,
} from "@evenements/chargement/domain/1jeune1solution/services/charger-evenements-domain.service";

export class ChargerFluxTousMobilisesUseCase implements Usecase {
  constructor(private readonly domain: ChargerEvenenementsDomainService) {}


  async executer(nomFlux: string): Promise<void> {
    return this.domain.charger(nomFlux);
  }

}
