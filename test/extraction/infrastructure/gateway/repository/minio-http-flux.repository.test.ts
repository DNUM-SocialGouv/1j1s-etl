import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Client } from "minio";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Configuration } from "@extraction/configuration/configuration";
import { EcritureFluxErreur } from "@extraction/domain/flux.repository";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { FlowStrategy } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { Flux } from "@extraction/domain/flux";
import { Logger} from "@shared/configuration/logger";
import { LoggerStrategy } from "@extraction/configuration/logger-strategy";
import { MinioHttpFlowRepository } from "@extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";

const localFileNameIncludingPath = "/tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
let flow: Flux;

let fileContent: string;
let fileNameIncludingPath: string;
let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let flowStrategy: StubbedType<FlowStrategy>;
let loggerStrategy: StubbedClass<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flowRepository: MinioHttpFlowRepository;

describe("MinioHttpFluxRepositoryTest", () => {
	beforeEach(() => {
		fileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
		fileContent = "<toto>contenu du fichier</toto>\n";

		flow = {
			nom: "flowName",
			url: "http://some.url",
			dossierHistorisation: "history",
			extension: ".xml",
		};

		minioStub = stubClass(Client);

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.RAW_BUCKET_NAME = "raw";
		configuration.TEMPORARY_DIRECTORY_PATH = "/tmp/";

		fileSystemClient = stubInterface<FileSystemClient>(sinon);

		uuidClient = stubInterface<UuidGenerator>(sinon);
		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");

		flowStrategy = stubInterface<FlowStrategy>(sinon);
		flowStrategy.get.withArgs(flow).resolves("<some>contenu</some>");

		loggerStrategy = stubClass(LoggerStrategy);
		logger = stubInterface<Logger>(sinon);
		loggerStrategy.get.returns(logger);

		flowRepository = new MinioHttpFlowRepository(
			configuration,
			minioStub,
			fileSystemClient,
			uuidClient,
			flowStrategy,
			loggerStrategy,
		);
	});

	context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		it("j'écris le contenu d'un fichier", async () => {
			await flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow);

			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, fileContent);
			expect(minioStub.fPutObject).to.have.been.calledOnce;
			expect(minioStub.fPutObject).to.have.been.calledWith(
				configuration.MINIO.RAW_BUCKET_NAME,
				fileNameIncludingPath,
				localFileNameIncludingPath
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier compressé qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		beforeEach(() => {
			flow.extension = ".xml.gz";
			fileNameIncludingPath = fileNameIncludingPath.concat(".gz");
		});

		it("j'écris le contenu d'un fichier", async () => {
			await flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow, true);

			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, fileContent);
			expect(minioStub.fPutObject).to.have.been.calledOnce;
			expect(minioStub.fPutObject).to.have.been.calledWith(
				configuration.MINIO.RAW_BUCKET_NAME,
				fileNameIncludingPath.replace(".gz", ""),
				localFileNameIncludingPath
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
		beforeEach(() => {
			fileSystemClient.write.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`
			);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
		" fichier est invalide", () => {
		beforeEach(() => {
			minioStub.fPutObject.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je récupère le contenu d'un flux", () => {
		it("je retourne son contenu", async () => {
			const result = await flowRepository.recuperer(flow);

			expect(result).to.eql("<some>contenu</some>");

			expect(flowStrategy.get).to.have.been.calledOnce;
			expect(flowStrategy.get).to.have.been.calledWith({ ...flow });
		});
	});
});
