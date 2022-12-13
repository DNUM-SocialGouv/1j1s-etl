import { AxiosInstance } from "axios";

import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";


export interface HttpClient {
	delete(annonceASupprimer: UnJeune1Solution.AnnonceDeLogementObsolete): Promise<void>;

	get(source: string): Promise<Array<AnnonceDeLogementHttp>>;

	post(annonce: UnJeune1Solution.NouvelleAnnonceDeLogement): Promise<void>;

	put(miseAJourAnnonceDeLogement: UnJeune1Solution.AnnonceDeLogementAMettreAJour): Promise<void>;
}

type StrapiResponse = {
	data: Array<AnnonceDeLogementHttp>
	meta: {
		pagination: {
			page: number
			pageSize: number
			pageCount: number
			total: number
		}
	}
}

export type AnnonceDeLogementHttp = {
	readonly id: string;
	readonly attributes: {
		readonly identifiantSource: string;
		readonly sourceUpdatedAt: string;
	}
}

export class StrapiClient implements HttpClient {
	private static FIELDS_TO_RETRIEVE = "identifiantSource,id,sourceUpdatedAt";
	private static OCCURENCIES_NUMBER_PER_PAGE = 100;

	constructor(
		private readonly axios: AxiosInstance,
		private readonly annonceLogementUrl: string,
		private readonly authClient: AuthenticationClient,
	) {
	}

	public async get(source: string): Promise<Array<AnnonceDeLogementHttp>> {
		const result = await this.axios.get<StrapiResponse>(this.annonceLogementUrl,
			{
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": StrapiClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiClient.OCCURENCIES_NUMBER_PER_PAGE,
					"sort": "identifiantSource",
				},
			});

		const housingAdvertisement = result.data.data;
		const pageCount = result.data.meta.pagination.pageCount;

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			housingAdvertisement.push(...
				(await this.axios.get<StrapiResponse>(
					this.annonceLogementUrl,
					{
						params: {
							"filters[source][$eq]": encodeURI(source),
							"fields": StrapiClient.FIELDS_TO_RETRIEVE,
							"pagination[page]": pageNumber,
							"pagination[pageSize]": StrapiClient.OCCURENCIES_NUMBER_PER_PAGE,
							"sort": "identifiantSource",
						},
					},
				)).data.data,
			);
		}

		return housingAdvertisement;
	}

	public async post(annonce: UnJeune1Solution.NouvelleAnnonceDeLogement): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		await this.axios.post<StrapiResponse>(this.annonceLogementUrl, { data: annonce.recupererAttributs() });
	}

	public async put(miseAJourAnnonceDeLogement: UnJeune1Solution.AnnonceDeLogementAMettreAJour): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		await this.axios.put<StrapiResponse>(
			`${this.annonceLogementUrl}/${miseAJourAnnonceDeLogement.id}`,
			{ data: miseAJourAnnonceDeLogement.recupererAttributs() }
		);
	}

	public async delete(annonceASupprimer: UnJeune1Solution.AnnonceDeLogementObsolete): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		await this.axios.delete<StrapiResponse>(`${this.annonceLogementUrl}/${annonceASupprimer.id}`);
	}
}
