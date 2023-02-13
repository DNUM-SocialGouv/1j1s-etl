import { AuthentificationErreur, LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { Axios } from "axios";
import { Configuration } from "@evenements/src/extraction/configuration/configuration";
import { Logger } from "@shared/src/configuration/logger";
import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";

type TokenResponse = {
    access_token: string;
    expires_in: number;
}

export class TousMobilisesBasicFlowHttpClient implements FlowClient {
    constructor(private readonly axios: Axios, private readonly configuration: Configuration) {}

    public async pull(url: string, logger: Logger): Promise<string> {
        const token = await this.getToken(logger);
        try {
            logger.info(`Starting to pull flow from url ${url}`);
            const response = await this.axios.get<string>(url, { headers: { Authorization: `Bearer ${token}` } });
            return JSON.stringify(response.data);
        } catch (e) {
            throw new LectureFluxErreur(url);
        } finally {
            logger.info(`End of pulling flow from url ${url}`);
        }
    }

    private async getToken(logger: Logger): Promise<string> {
        const paramsForAuth = new URLSearchParams();
        paramsForAuth.append("grant_type", "client_credentials");
        paramsForAuth.append("client_id", this.configuration.TOUS_MOBILISES.CLIENT_ID);
        paramsForAuth.append("client_secret", this.configuration.TOUS_MOBILISES.CLIENT_SECRET);
        paramsForAuth.append("scope", this.configuration.TOUS_MOBILISES.SCOPE);

        logger.info("Starting to get bearer token");
        try {
            const responseAuth = await this.axios.post<TokenResponse>(
                this.configuration.TOUS_MOBILISES.AUTH_URL,
                paramsForAuth,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
            );
            return responseAuth.data.access_token;
        } catch (e) {
            throw new AuthentificationErreur(this.configuration.TOUS_MOBILISES.NAME);
        } finally {
            logger.info("End of getting bearer token");
        }
    }
}
