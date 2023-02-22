import { AxiosInstance } from "axios";
import { DateTime } from "luxon";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";

type StrapiEvenementResponse = {
    data: Array<StrapiEvenement>
    meta: {
        pagination: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}

export type StrapiEvenement = {
    readonly id: string;
    readonly attributes: {
        description: string
        idSource: string
        lieuEvenement: string
        modaliteInscription: string
        online: boolean
        organismeOrganisateur: string
        titreEvenement: string
        typeEvenement: string
        source: string
        slug: string
        createdAt: string
        updatedAt: string
        publishedAt: string
        dateDebut: string
        dateFin: string
    }
}

export class StrapiEvenementHttpClient {
    private OCCURENCIES_NUMBER_PER_PAGE = 100;

    constructor(
        private readonly axios: AxiosInstance,
        private readonly authClient: AuthenticationClient,
        private readonly evenementUrl: string,
    ) {
    }

    public async delete(evenement: UnJeuneUneSolution.EvenementASupprimer): Promise<void> {
        await this.authClient.handleAuthentication(this.axios);
        return this.axios.delete(`${this.evenementUrl}/${evenement.id}`);
    }

    public async getAll(source: string): Promise<Array<UnJeuneUneSolution.EvenementDejaCharge>> {
        await this.authClient.handleAuthentication(this.axios);
        const result = await this.axios.get<StrapiEvenementResponse>(
            this.evenementUrl,
            {
                params: {
                    "filters[source][$eq]": encodeURI(source),
                    "pagination[pageSize]": this.OCCURENCIES_NUMBER_PER_PAGE,
                },
            },
        );
        const data = result.data.data;
        const pageCount = result.data.meta.pagination.pageCount;

        for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
            data.push(...
                (await this.axios.get<StrapiEvenementResponse>(
                    this.evenementUrl,
                    {
                        params: {
                            "filters[source][$eq]": encodeURI(source),
                            "pagination[page]": pageNumber,
                            "pagination[pageSize]": this.OCCURENCIES_NUMBER_PER_PAGE,
                        },
                    },
                )).data.data
            );
        }

        return data.map(({ id, attributes }) => ({
            id: Number(id),
            dateDebut: DateTime.fromISO(attributes.dateDebut, { zone: "Europe/Paris" }).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
            source: attributes.source,
            idSource: attributes.idSource,
            dateFin: DateTime.fromISO(attributes.dateFin, { zone: "Europe/Paris" }).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
            description: attributes.description,
            lieuEvenement: attributes.lieuEvenement,
            modaliteInscription: attributes.modaliteInscription,
            online: attributes.online,
            organismeOrganisateur: attributes.organismeOrganisateur,
            titreEvenement: attributes.titreEvenement,
            typeEvenement: attributes.typeEvenement,
        }));
    }

    public async post(evenementsAAjouter: UnJeuneUneSolution.EvenementAAjouter): Promise<void> {
        await this.authClient.handleAuthentication(this.axios);
        return this.axios.post(this.evenementUrl, { data: evenementsAAjouter });
    }

    public async put(evenementAMettreAJour: UnJeuneUneSolution.EvenementAMettreAJour): Promise<void> {
        await this.authClient.handleAuthentication(this.axios);
        return this.axios.put(`${this.evenementUrl}/${evenementAMettreAJour.id}`, { data: evenementAMettreAJour });
    }
}
