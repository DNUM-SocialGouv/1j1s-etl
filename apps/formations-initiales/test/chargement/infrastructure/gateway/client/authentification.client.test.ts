import { AxiosInstance } from "axios";

import { expect, sinon, StubbedCallableType, stubCallable } from "@test/library";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

const credentials = { username: "Toto", password: "leFameuxMotDePasse123" };
const authUrl = "/auth/url";
const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
let axiosInstance: StubbedCallableType<AxiosInstance>;
let authenticationClient: AuthenticationClient;

describe("AuthenticationClientTest", () => {
	beforeEach(() => {
		axiosInstance = stubCallable<AxiosInstance>(sinon);
		axiosInstance.delete = sinon.stub();
		axiosInstance.post = sinon.stub();
		axiosInstance.post.resolves({ data: { jwt: bearerToken } });
		axiosInstance.put = sinon.stub();
		axiosInstance.interceptors = {
			request: {
				use: sinon.stub(),
				eject: sinon.stub(),
				clear: sinon.stub(),
			},
			response: {
				use: sinon.stub(),
				eject: sinon.stub(),
				clear: sinon.stub(),
			},
		};

		authenticationClient = new AuthenticationClient(authUrl, credentials);
	});

	context("Lorsque je gère l'authentification Bearer avant un appel HTTP et que c'est nécessaire", () => {
		it("je m'authentifie", async () => {
			// When
			await authenticationClient.handleAuthentication(axiosInstance);

			// Then
			expect(authenticationClient.getToken()).to.eql(bearerToken);

			expect(axiosInstance.post).to.have.been.calledOnce;
			expect(axiosInstance.post).to.have.been.calledWith(authUrl, {
				identifier: credentials.username,
				password: credentials.password,
			});
		});
	});

	context("Lorsque je gère l'authentification Bearer avant un appel HTTP et que ce n'est pas nécessaire", () => {
		it("je ne fais rien", async () => {
			// Given
			authenticationClient = new AuthenticationClient(authUrl, credentials, "default value");

			// When
			await authenticationClient.handleAuthentication(axiosInstance);

			// Then
			expect(authenticationClient.getToken()).to.eql("default value");
			expect(axiosInstance.post).to.not.have.been.called;
		});
	});
});
