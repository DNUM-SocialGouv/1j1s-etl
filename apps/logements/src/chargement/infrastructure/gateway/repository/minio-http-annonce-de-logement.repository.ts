import { UnJeune1Solution } from "@logements/src/chargement/domain/model/1jeune1solution";
import { FluxChargement } from "@logements/src/chargement/domain/model/flux";
import { AnnonceDeLogementRepository } from "@logements/src/chargement/domain/service/annonce-de-logement.repository";
import { HttpClient } from "@logements/src/chargement/infrastructure/gateway/client/http.client";
import { StorageClient } from "@logements/src/chargement/infrastructure/gateway/client/storage.client";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";

export class MinioHttpAnnonceDeLogementRepository implements AnnonceDeLogementRepository {
	private static readonly SPACE = 2;
	private static readonly CREATED = "_created";
	private static readonly UPDATED = "_updated";
	private static readonly DELETED = "_deleted";
	private static readonly ERROR = "_error";

	constructor(
		private readonly minioClient: StorageClient,
		private readonly httpClient: HttpClient,
		private readonly dateService: DateService,
		protected readonly loggerStrategy: LoggerStrategy,
	) {
	}

	public async charger(
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>,
		flowName: string,
	): Promise<Array<UnJeune1Solution.AnnonceDeLogementEnErreur>> {
		const logger = this.loggerStrategy.get(flowName);
		logger.info(`Starting to load housing advertisements from flow ${flowName}`);
		logger.info(`The ${flowName} flow have ${annoncesDeLogement.length} housing advertisements outdated`);
		const advertisementsInError: Array<UnJeune1Solution.AnnonceDeLogementEnErreur> = [];

		for (const housingAdvertisement of annoncesDeLogement) {
			try {
				await this.loadAdvertisement(flowName, housingAdvertisement);
			} catch (error) {
				advertisementsInError.push({
					annonce: housingAdvertisement,
					motif: (<Error>error).message,
				});
			}
		}

		logger.info(`The ${flowName} flow have ${advertisementsInError.length} housing advertisements not updated`);
		logger.info(`Ending to load housing advertisements from flow ${flowName}`);

		return advertisementsInError;
	}

	public async preparerLeSuivi(
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>,
		flux: FluxChargement
	): Promise<void> {
		this.loggerStrategy.get(flux.nom).info(`Starting to prepare monitoring flow ${flux.nom}`);
		const now = this.dateService.maintenant().toISOString();
		const filePathWithoutExtension = `${flux.nom}/${now}`;

		await this.prepareNewAdsFollowUp(filePathWithoutExtension, flux, annoncesDeLogement);
		await this.prepareAdsToBeUpdatedFollowUp(filePathWithoutExtension, flux, annoncesDeLogement);
		await this.prepareObsoleteAdsFollowUp(filePathWithoutExtension, flux, annoncesDeLogement);
		await this.prepareInErrorAdsFollowUp(filePathWithoutExtension, flux, annoncesDeLogement);

		this.loggerStrategy.get(flux.nom).info(`Ending to prepare monitoring flow ${flux.nom}`);
	}

	private async prepareInErrorAdsFollowUp(
		filePathWithoutExtension: string,
		flux: FluxChargement,
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>
	): Promise<void> {
		await this.minioClient.ecrire(
			filePathWithoutExtension.concat(MinioHttpAnnonceDeLogementRepository.ERROR, flux.extension),
			this.toReadableJson(annoncesDeLogement.filter(
				(annonceDeLogement) => this.isAnnonceDeLogementEnErreur(annonceDeLogement))),
			flux.nom,
		);
	}

	private async prepareObsoleteAdsFollowUp(
		filePathWithoutExtension: string,
		flux: FluxChargement,
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>
	): Promise<void> {
		await this.minioClient.ecrire(
			filePathWithoutExtension.concat(MinioHttpAnnonceDeLogementRepository.DELETED, flux.extension),
			this.toReadableJson(annoncesDeLogement.filter(
				(annonceDeLogement) => annonceDeLogement instanceof UnJeune1Solution.AnnonceDeLogementObsolete)),
			flux.nom,
		);
	}

	private async prepareAdsToBeUpdatedFollowUp(
		filePathWithoutExtension: string,
		flux: FluxChargement,
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>
	): Promise<void> {
		await this.minioClient.ecrire(
			filePathWithoutExtension.concat(MinioHttpAnnonceDeLogementRepository.UPDATED, flux.extension),
			this.toReadableJson(annoncesDeLogement.filter(
				(annonceDeLogement) => annonceDeLogement instanceof UnJeune1Solution.AnnonceDeLogementAMettreAJour)),
			flux.nom,
		);
	}

	private async prepareNewAdsFollowUp(
		filePathWithoutExtension: string,
		flux: FluxChargement,
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>
	): Promise<void> {
		await this.minioClient.ecrire(
			filePathWithoutExtension.concat(MinioHttpAnnonceDeLogementRepository.CREATED, flux.extension),
			this.toReadableJson(annoncesDeLogement.filter(
				(annonceDeLogement) => annonceDeLogement instanceof UnJeune1Solution.NouvelleAnnonceDeLogement)),
			flux.nom,
		);
	}

	public async recupererAnnoncesDeLogementNonReferencees(flux: FluxChargement): Promise<Array<UnJeune1Solution.AnnonceDeLogement>> {
		this.loggerStrategy.get(flux.nom).info(`Starting to pull existing housing advertisement from flow ${flux.nom}`);
		const filePath = `${flux.nom}/latest${flux.extension}`;
		const attributsAnnonceDeLogements = await this.minioClient.lire(filePath, flux.nom);
		this.loggerStrategy.get(flux.nom).info(`Ending to pull existing housing advertisement from flow ${flux.nom}`);
		return attributsAnnonceDeLogements.map((attributs) => new UnJeune1Solution.AnnonceDeLogement(attributs));
	}

	public async recupererAnnoncesDeLogementReferencees(flux: FluxChargement): Promise<Array<UnJeune1Solution.AnnonceDeLogementReferencee>> {
		this.loggerStrategy.get(flux.nom).info(`Starting to pull latest housing advertisement from flow ${flux.nom}`);
		const annoncesDeLogement = await this.httpClient.get(flux.nom);
		const annoncesARetourner: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [];

		for (const annonce of annoncesDeLogement) {
			const { id } = annonce;
			const { identifiantSource, sourceUpdatedAt } = annonce.attributes;

			annoncesARetourner.push({
				id,
				identifiantSource,
				sourceUpdatedAt,
			});
		}

		this.loggerStrategy.get(flux.nom).info(`Ending to pull latest housing advertisement from flow ${flux.nom}`);
		return annoncesARetourner;
	}

	private async loadAdvertisement(flowName: string, advertisement: UnJeune1Solution.AnnonceDeLogement): Promise<void> {
		this.loggerStrategy.get(flowName).debug(`Starting to push ${advertisement.titre ? advertisement.titre : advertisement.identifiantSource} advertisement from flow ${flowName}`);
		if (advertisement instanceof UnJeune1Solution.NouvelleAnnonceDeLogement) {
			await this.httpClient.post(advertisement);
		} else if (advertisement instanceof UnJeune1Solution.AnnonceDeLogementObsolete) {
			await this.httpClient.delete(advertisement);
		} else if (advertisement instanceof UnJeune1Solution.AnnonceDeLogementAMettreAJour) {
			await this.httpClient.put(advertisement);
		} else {
			throw new Error("Advertisement is not handled by this method");
		}
		this.loggerStrategy.get(flowName).debug(`Ending to push ${advertisement.titre ? advertisement.titre : advertisement.identifiantSource} advertisement from flow ${flowName}`);
	}

	private toReadableJson(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur>): string {
		return JSON.stringify(annoncesDeLogement, null, MinioHttpAnnonceDeLogementRepository.SPACE);
	}

	private isAnnonceDeLogementEnErreur(value: UnJeune1Solution.AnnonceDeLogement | UnJeune1Solution.AnnonceDeLogementEnErreur): value is UnJeune1Solution.AnnonceDeLogementEnErreur {
		return (value as UnJeune1Solution.AnnonceDeLogementEnErreur).motif !== undefined;
	}
}
