import { Client } from "minio";

import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { Configuration } from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import { HttpClient } from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";
import {
	MinioAndStrapiFormationsInitialesRepository,
} from "@formations-initiales/src/chargement/infrastructure/gateway/repository/minio-and-strapi-formations-initiales.repository";

import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class FeatureFlippingFormationsInitialesRepository extends MinioAndStrapiFormationsInitialesRepository {
	constructor(
		configuration: Configuration,
		minioClient: Client,
		httpClient: HttpClient,
		fileSystemClient: FileSystemClient,
		uuidGenerator: UuidGenerator,
		loggerStrategy: LoggerStrategy,
	) {
		super(configuration, minioClient, httpClient, fileSystemClient, uuidGenerator, loggerStrategy);
	}

	public override chargerLesFormationsInitialesDansLeCMS(
		formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		flowName: string,
	): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).debug(`Nombre de formations initiales à publier : ${formationsInitiales.length}`);
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeEnErreur>);
	}

	public override async recupererFormationsInitialesASupprimer(source: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>> {
		this.loggerStrategy.get(source).info("Récupération des formations initiales à supprimer");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASupprimer>);
	}

	public override async enregistrerDansLeMinio(): Promise<void> {
		return Promise.resolve();
	}

	public override async supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>> {
		this.loggerStrategy.get(flowName).debug(`Nombre de formations initiales à supprimer : ${formationsInitiales.length}`);
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeEnErreur>);
	}

	public override async recupererFormationsInitialesASauvegarder(flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>> {
		this.loggerStrategy.get(flowName).info("Récupération des formations initiales à sauvegarder");
		return Promise.resolve([] as Array<UnJeuneUneSolution.FormationInitialeASauvegarder>);
	}
}
