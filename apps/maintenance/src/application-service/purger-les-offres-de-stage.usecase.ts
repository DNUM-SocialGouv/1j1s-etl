import { OffreDeStage } from "@maintenance/src/domain/model/offre-de-stage";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";

import { Usecase } from "@shared/src/application-service/usecase";

export class PurgerLesOffresDeStage implements Usecase {
    constructor(private readonly offreDeStageRepository: OffreDeStageRepository) {
    }

    public async executer(flux: Array<string>): Promise<void> {
        const internships: Array<OffreDeStage> = await this.offreDeStageRepository.recuperer(flux);
        await this.offreDeStageRepository.supprimer(internships);
    }
}
