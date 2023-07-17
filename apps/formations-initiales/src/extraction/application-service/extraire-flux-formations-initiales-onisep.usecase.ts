import { Usecase } from "@shared/src/application-service/usecase";

import { FluxExtraction } from "../domain/model/flux";
import {
  ExtraireFluxDomainService,
} from "../domain/service/extraire-flux.domain-service";

export class ExtraireFluxFormationsInitialesOnisep implements Usecase {
  constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
  }

  public executer(flux: FluxExtraction): Promise<void> {
    return this.extraireFlux.extraire(flux);
  }
}
