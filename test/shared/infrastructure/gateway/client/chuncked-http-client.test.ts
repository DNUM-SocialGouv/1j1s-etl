
import { Axios } from "axios";
import { ChunkedHttpClient } from "@extraction/infrastructure/gateway/client/chunked-http.client";
import { Logger } from "@shared/configuration/logger";

import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import sinon from "sinon";

const contenu = "<toto>Contenu du fichier</toto>";
const urlDuFlux = "https://some.url.xml";

let chunckedHttpClient: ChunkedHttpClient;
let axios: StubbedClass<Axios>;
let logger: StubbedType<Logger>;

describe("ChunckedHttpClientTest", () => {

    context("Lorsque je récupère un flux existant", () => {

        beforeEach(() => {
            axios = stubClass(Axios);
            logger = stubInterface<Logger>(sinon);
            chunckedHttpClient = new ChunkedHttpClient(axios);
        });

        it("Je retourne son contenu", async () => {
            const result: string = await chunckedHttpClient.pull(urlDuFlux, logger);
            
            expect(result).to.eql(contenu);
        });
    });
});