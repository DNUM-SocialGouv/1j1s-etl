import { Internship } from "@maintenance/src/internship.type";
import { Internshi } from "@maintenance/src/repository/internship.repository";

import { Usecase } from "@shared/src/application-service/usecase";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

export class StagePurgeAll implements Usecase {

    public constructor(
        public httpRepository: Internshi,
        public strapiHttpClient: StrapiHttpClient,
    ){}
    
    public async executer(): Promise<void> {
        const flows = [
            "jobteaser",
            "stagefr-compresse",
            "stagefr-decompresse",
        ];

        const internships: Array<Internship> = [];

        for (const flow of flows) {
            internships.push(...(await this.strapiHttpClient.get(, flow)));
        }

        await this.httpRepository.deleteAll(internships);
    }
}
