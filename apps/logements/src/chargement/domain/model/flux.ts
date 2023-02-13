import { Flux } from "@shared/src/flux";

export class FluxChargement extends Flux {

    constructor(
        nom: string,
        extension: string,
    ) {
        super(nom, extension);
    }
}
