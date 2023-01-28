import { Client } from "minio";
import { Configuration } from "@logements/extraction/configuration/configuration";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/configuration";
import { EcritureFluxErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { FlowStrategy } from "@shared/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@logements/extraction/domain/model/flux";
import { Logger, LoggerStrategy } from "@shared/configuration/logger";
import {
	MinioHttpFlowRepository,
} from "@logements/extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";

const localFileNameIncludingPath = "/tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
let flow: FluxExtraction;

let fileContent: string;
let fileNameIncludingPath: string;
let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let flowStrategy: StubbedType<FlowStrategy>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flowRepository: MinioHttpFlowRepository;

describe("MinioHttpFlowRepositoryTest", () => {
	beforeEach(() => {
		fileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
		fileContent = "<toto>contenu du fichier</toto>\n";

		flow = new FluxExtraction(
			"flowName",
			".xml",
			"history",
			"http://some.url",
		);

		minioStub = stubClass(Client);

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.RAW_BUCKET_NAME = "raw";
		configuration.TEMPORARY_DIRECTORY_PATH = "/tmp/";

		fileSystemClient = stubInterface<FileSystemClient>(sinon);

		uuidClient = stubInterface<UuidGenerator>(sinon);
		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");

		flowStrategy = stubInterface<FlowStrategy>(sinon);
		flowStrategy.get.withArgs(flow).resolves("<some>contenu</some>");

		loggerStrategy = stubInterface<LoggerStrategy>(sinon);
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
				localFileNameIncludingPath,
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
				`Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`,
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
				`Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`,
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
			expect(flowStrategy.get).to.have.been.calledWith(
				new FluxExtraction(
					"flowName",
					".xml",
					"history",
					"http://some.url",
				),
			);
		});
	});
});
