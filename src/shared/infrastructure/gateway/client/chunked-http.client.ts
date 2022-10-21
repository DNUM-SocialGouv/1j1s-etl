import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { Logger } from "@shared/configuration/logger";
import { Axios, AxiosProgressEvent } from "axios";

export class ChunkedHttpClient implements FlowClient {
    
    constructor(private readonly axios: Axios){
    }
    
    async pull(url: string, logger: Logger): Promise<string> {
        const response = (await this.axios.get<string>(
            url, 
            {
                responseType: "stream", 
                onDownloadProgress: ((progressEvent: AxiosProgressEvent) => {
                    if(progressEvent.progress){
						logger.info((progressEvent.progress * 100).toFixed(2));
					}
                }),
                
            }
        ));

        return response.data;
    }
    
}