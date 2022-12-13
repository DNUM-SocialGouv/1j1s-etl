import { Flux } from "@shared/flux";

export class FluxLogement extends Flux {

    constructor(
        nom: string,
        extension: string,
    ) {
        super(nom, extension);
    }
}
