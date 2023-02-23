import { Client } from "minio";

import { expect, StubbedClass, stubClass } from "@test/configuration";

import { MinioAdminStorageRepository } from "@shared/src/infrastructure/gateway/repository/minio-admin-storage.repository";

const bucketName = "bucket-name";
let minioClient: StubbedClass<Client>;
let minioAdminStorageClient: MinioAdminStorageRepository;

describe("MinioAdminStorageClientTest", () => {
	beforeEach(() => {
		minioClient = stubClass<Client>(Client);
		minioAdminStorageClient = new MinioAdminStorageRepository(minioClient);
	});

	context("Lorsque le bucket existe sur le dépôt Minio", () => {
		beforeEach(() => {
			minioClient.bucketExists.resolves(true);
		});

		it("on ne crée pas le bucket", async () => {
			await minioAdminStorageClient.createBucket(bucketName);

			expect(minioClient.bucketExists).to.have.been.calledOnce;
			expect(minioClient.bucketExists).to.have.been.calledWith(bucketName);
			expect(minioClient.makeBucket).to.not.have.been.called;
		});
	});

	context("Lorsque le bucket n'existe pas sur le dépôt Minio", () => {
		beforeEach(() => {
			minioClient.bucketExists.resolves(false);
		});

		it("on crée le bucket avec le nom demandé", async () => {
			await minioAdminStorageClient.createBucket(bucketName);

			expect(minioClient.bucketExists).to.have.been.calledOnce;
			expect(minioClient.bucketExists).to.have.been.calledWith(bucketName);
			expect(minioClient.makeBucket).to.have.been.calledOnce;
			expect(minioClient.makeBucket).to.have.been.calledWith(bucketName);
		});
	});
});
