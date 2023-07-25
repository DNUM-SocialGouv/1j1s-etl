import { FluxExtraction } from "@formations-initiales/src/extraction/domain/model/flux";
import {
  ExtraireFluxDomainService,
} from "@formations-initiales/src/extraction/domain/service/extraire-flux.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class ExtraireFluxFormationsInitialesOnisep implements Usecase {
  constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
  }

  public executer(flux: FluxExtraction): Promise<void> {
    return this.extraireFlux.extraire(flux);
  }
}
