import { Internship } from "@maintenance/src/internship.type";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

export interface InternshipRepository {
    getAll(flow: string): Promise<Array<Internship>>;
    deleteAll(internships: Array<Internship>): Promise<void>;
}

export class CMSInternshipRepository implements InternshipRepository {
    constructor(public readonly strapiHttpClient: StrapiHttpClient) {
    }

    public async getAll(flow: string): Promise<Array<Internship>> {
        return [];
    }

    public async deleteAll(internships: Array<Internship>): Promise<void> {
    }
}
