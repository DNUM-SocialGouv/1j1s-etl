import { Client } from "minio";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { MinioAdminStorageClient } from "@shared/gateway/minio-admin-storage.client";

const bucketName = "bucket-name";
let minioClient: StubbedClass<Client>;
let minioAdminStorageClient: MinioAdminStorageClient;

describe("MinioAdminStorageClientTest", () => {
	beforeEach(() => {
		minioClient = stubClass<Client>(Client);
		minioAdminStorageClient = new MinioAdminStorageClient(minioClient);
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

		it("on crée le bucket", async () => {
			await minioAdminStorageClient.createBucket(bucketName);

			expect(minioClient.bucketExists).to.have.been.calledOnce;
			expect(minioClient.bucketExists).to.have.been.calledWith(bucketName);
			expect(minioClient.makeBucket).to.have.been.calledOnce;
			expect(minioClient.makeBucket).to.have.been.calledWith(bucketName);
		});
	});
});
