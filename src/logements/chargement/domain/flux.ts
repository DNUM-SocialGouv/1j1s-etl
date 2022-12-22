import { Flux } from "@shared/flux";

export class FluxChargement extends Flux {

    constructor(
        nom: string,
        extension: string,
    ) {
        super(nom, extension);
    }
}
