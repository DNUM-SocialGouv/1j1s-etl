import { AxiosInstance } from "axios";

type StrapiCredentials = {
	username: string
	password: string
}

export class AuthenticationClient {
	private token: string;

	constructor(
		private readonly authUrl: string,
		private readonly credentials: StrapiCredentials,
		initialToken = ""
	) {
		this.token = initialToken;
	}

	async handleAuthentication(axiosInstance: AxiosInstance): Promise<void> {
		if (!this.isAuthenticated()) {
			this.token = await this.authenticate(axiosInstance);
			axiosInstance.interceptors.request.use((config) => {
				config.headers!.Authorization = `Bearer ${this.token}`;
				return config;
			});
		}
	}

	private isAuthenticated(): boolean {
		return !!this.token;
	}

	private async authenticate(axiosInstance: AxiosInstance): Promise<string> {
		const axiosResponse = await axiosInstance.post<{ jwt: string }>(this.authUrl, this.credentialsToBody());
		return axiosResponse.data.jwt;
	}

	private credentialsToBody(): { identifier: string, password: string } {
		return { identifier: this.credentials.username, password: this.credentials.password };
	}

	getToken(): string {
		return this.token;
	}
}

