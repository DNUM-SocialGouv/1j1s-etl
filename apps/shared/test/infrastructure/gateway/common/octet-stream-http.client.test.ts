import { PassThrough, Writable } from "stream";

import { AxiosInstance } from "axios";
import sinon from "sinon";
import { StubbedCallableType, StubbedType, stubCallable, stubInterface } from "@salesforce/ts-sinon";
import { expect } from "@test/configuration";

import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

const url = "http://some.url";
const fileName = "7d92007e-3f8a-40ad-b648-3b4c806b9647";
const temporaryFilePath = "/tmp/".concat(fileName);
let valeurDeRetour: Buffer;
let valeurSousFormeDeStream: Writable;

let axios: StubbedCallableType<AxiosInstance>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidGenerator: StubbedType<UuidGenerator>;
let octetStreamHttpClient: OctetStreamHttpClient;

describe("OctetStreamHttpClientTest", () => {
	beforeEach(() => {
		valeurDeRetour = Buffer.from("<jobs><job><title>Le stage de nos rêves</title></job></jobs>");
		valeurSousFormeDeStream = new PassThrough(Buffer.from("<jobs><job><title>Le stage de nos rêves</title></job></jobs>"));

		axios = stubCallable<AxiosInstance>(sinon);
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		uuidGenerator = stubInterface<UuidGenerator>(sinon);

		uuidGenerator.generate.returns(fileName);

		octetStreamHttpClient = new OctetStreamHttpClient(axios, fileSystemClient, uuidGenerator, "/tmp/");

		axios.get.withArgs(url).resolves({ data: valeurSousFormeDeStream });
		fileSystemClient.read.resolves(valeurDeRetour);
	});

	context("Lorsque je récupère le contenu d'un flux sous la forme d'octet stream", () => {
		it("je retourne un buffer contenant tout le contenu du stream", async () => {
			const resultat = await octetStreamHttpClient.readStream(url);

			expect(resultat).to.eql(valeurDeRetour);

			expect(axios.get).to.have.been.calledOnce;
			expect(axios.get).to.have.been.calledWith(url);

			expect(fileSystemClient.writeStream).to.have.been.calledOnce;
			expect(fileSystemClient.writeStream).to.have.been.calledWith(temporaryFilePath, valeurSousFormeDeStream);

			expect(fileSystemClient.read).to.have.been.calledOnce;
			expect(fileSystemClient.read).to.have.been.calledWith(temporaryFilePath);

			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(temporaryFilePath);
		});
	});

	context("Lorsque je récupère le contenu d'un flux sous la forme d'octet stream et que ça tourne mal", () => {
		beforeEach(() => {
			axios.get.withArgs(url).rejects(new Error("Oops something went wrong"));
		});

		it("je lance une erreur", async () => {
			await expect(octetStreamHttpClient.readStream(url)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`,
			);

			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(temporaryFilePath);
		});
	});
});
