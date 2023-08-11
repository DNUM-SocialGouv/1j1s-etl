import { Client } from "minio";

import {
	UnJeuneUneSolution,
} from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import {
	FormationsInitialesRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales.repository";
import { Configuration } from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import { HttpClient } from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import {
	EcritureFluxErreur,
	RecupererContenuErreur, RecupererOffresExistantesErreur,
} from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioAndStrapiFormationsInitialesRepository implements FormationsInitialesRepository {
	protected static NOM_DU_FICHIER_A_RECUPERER = "latest";
	static readonly INDENTATION_JSON: number = 2;
	static readonly REMPLACANT_JSON: null = null;
	static readonly EXTENSION_DU_FICHIER: string = ".json";

	constructor(
		protected readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly httpClient: HttpClient,
		protected readonly fileSystemClient: FileSystemClient,
		protected readonly uuidGenerator: UuidGenerator,
		protected readonly loggerStrategy: LoggerStrategy,
		private readonly dateService: DateService,
	) {
	}

	public async chargerLesFormationsInitiales(
		formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		flowName: string,
	): Promise<{
		formationsInitialesSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>,
	}> {
		const logger = this.loggerStrategy.get(flowName);
		logger.info(`Starting to load formations initiales from flow ${flowName}`);
		logger.info(`The ${flowName} flow have ${formationsInitiales.length} formations initiales to load`);
		const formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur> = [];
		const formationsInitialesSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder> = [];

		for (const formationInitiale of formationsInitiales) {
			try {
				await this.chargerUneFormationInitialeDansLeCMS(flowName, formationInitiale);

				formationsInitialesSauvegardees.push(formationInitiale);
			} catch (error) {
				formationsInitialesEnErreur.push({
					formationInitiale: formationInitiale,
					motif: (<Error>error).message,
				});
			}
		}

		logger.info(`The ${flowName} flow have ${formationsInitialesEnErreur.length} formations initiales not loaded`);
		logger.info(`Ending to load formations initiales from flow ${flowName}`);

		return {
			formationsInitialesSauvegardees,
			formationsInitialesEnErreur,
		};
	}

	public async recupererFormationsInitialesASupprimer(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>> {
		this.loggerStrategy.get(flowName).info(`Starting to pull existing formations intiales flow ${flowName} from CMS`);
		try {
			const formationsInitialesHttp = await this.httpClient.getAll();

			return formationsInitialesHttp.map((formationInitialeHttp) => new UnJeuneUneSolution.FormationInitialeASupprimer(
				formationInitialeHttp.attributes,
				formationInitialeHttp.id,
			));
		} catch (e) {
			throw new RecupererOffresExistantesErreur();
		} finally {
			this.loggerStrategy.get(flowName).info(`End of pulling existing formations initiales flow ${flowName} from CMS`);
		}
	}

	private async historiser(filePath: string, fileContent: string, flowName: string): Promise<void> {
		this.loggerStrategy.get(flowName).info(`Starting to save formations initiales in Minio flow ${flowName}`);
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO.RESULT_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath,
			);
		} catch (e) {
			throw new EcritureFluxErreur(flowName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flowName).info(`End of saving formations initiales in Minio flow ${flowName}`);
		}
	}

	public async supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).info("Starting to delete the formations initiales");
		const formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur> = [];
		for await (const formationInitiale of formationsInitiales) {
			try {
				await this.httpClient.delete(formationInitiale);
			} catch (error) {
				formationsInitialesEnErreur.push({
					formationInitiale: formationInitiale,
					motif: (<Error>error).message,
				});
				this.loggerStrategy.get(flowName).error({
					msg: `The formation initiale from ${flowName} with id = ${formationInitiale.id} has not been deleted`,
					extra: { error: JSON.stringify(error) },
				});
			}
		}
		this.loggerStrategy.get(flowName).info(`End of deleting flow ${flowName}`);
		return formationsInitialesEnErreur;
	}

	public async recupererFormationsInitialesASauvegarder(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>> {
		this.loggerStrategy.get(flowName).info(`Starting to pull latest formations initiales from flow ${flowName}`);
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);
		const sourceFilePath = `${flowName}/${MinioAndStrapiFormationsInitialesRepository.NOM_DU_FICHIER_A_RECUPERER}${this.configuration.MINIO.TRANSFORMED_FILE_EXTENSION}`;

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				sourceFilePath,
				localFileNameIncludingPath,
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return (<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>>JSON.parse(fileContent.toString()))
				.map((formationInitiale) => new UnJeuneUneSolution.FormationInitialeASauvegarder(formationInitiale));
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flowName).info(`End of pulling latest formations initiales from flow ${flowName}`);
		}
	}

	private async chargerUneFormationInitialeDansLeCMS(flowName: string, formationInitiale: UnJeuneUneSolution.FormationInitialeASauvegarder): Promise<void> {
		this.loggerStrategy.get(flowName).debug(`Starting to push formation initiale ${formationInitiale.identifiant} from flow ${flowName}`);
		await this.httpClient.post(formationInitiale);
		this.loggerStrategy.get(flowName).debug(`Ending to push formation initiale ${formationInitiale.identifiant} from flow ${flowName}`);
	}

	public async enregistrerHistoriqueDesFormationsSauvegardees(formationsSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<void> {
		const cheminDuFichier = this.creeLeCheminDuFichierDeResultat(
			nomDuFlux,
			MinioAndStrapiFormationsInitialesRepository.EXTENSION_DU_FICHIER,
		);
		const contenuDuFichier = this.versJSONLisible(formationsSauvegardees);

		await this.historiser(cheminDuFichier, contenuDuFichier, nomDuFlux);
	}

	public async enregistrerHistoriqueDesFormationsNonSauvegardees(formationsNonSauvegardees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, nomDuFlux: string): Promise<void> {
		const cheminDuFichierAEnregistrerEnErreur = this.creeLeCheminDuFichierDeResultat(
			nomDuFlux,
			MinioAndStrapiFormationsInitialesRepository.EXTENSION_DU_FICHIER,
			"_NON_SAUVEGARDEES",
		);
		const contenuDuFichierAEnregistrerEnErreur = this.versJSONLisible(formationsNonSauvegardees);
		await this.historiser(cheminDuFichierAEnregistrerEnErreur, contenuDuFichierAEnregistrerEnErreur, nomDuFlux);
	}

	public async enregistrerHistoriqueDesFormationsNonSupprimees(formationsNonSupprimees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, nomDuFlux: string): Promise<void> {
		const cheminDuFichierASupprimerEnErreur = this.creeLeCheminDuFichierDeResultat(
			nomDuFlux,
			MinioAndStrapiFormationsInitialesRepository.EXTENSION_DU_FICHIER,
			"_NON_SUPPRIMEES",
		);

		const contenuDuFichierASupprimerEnErreur = this.versJSONLisible(formationsNonSupprimees);
		await this.historiser(cheminDuFichierASupprimerEnErreur, contenuDuFichierASupprimerEnErreur, nomDuFlux);
	}

	private creeLeCheminDuFichierDeResultat(
		nomDuFlux: string, extensionDuFichier: string, motifErreur?: string,
	): string {
		return `${nomDuFlux}/${this.dateService.maintenant().toISOString()}${motifErreur ?? ""}${extensionDuFichier}`;
	}

	private versJSONLisible(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder> | Array<UnJeuneUneSolution.FormationInitialeEnErreur>): string {
		return JSON.stringify(
			formationsInitiales,
			MinioAndStrapiFormationsInitialesRepository.REMPLACANT_JSON,
			MinioAndStrapiFormationsInitialesRepository.INDENTATION_JSON,
		);
	}
}
