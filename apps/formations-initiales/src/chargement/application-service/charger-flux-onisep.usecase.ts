import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import {
  ChargerFormationsInitialesDomainService,
} from "@formations-initiales/src/chargement/domain/service/charger-formations-initiales.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class ChargerFluxOnisep implements Usecase {
  constructor(private readonly domain: ChargerFormationsInitialesDomainService) {}

  async executer(flux: FluxChargement): Promise<void> {
    return this.domain.charger(flux);
  }
}
