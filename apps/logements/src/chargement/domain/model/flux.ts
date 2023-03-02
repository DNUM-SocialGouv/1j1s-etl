import { Flux } from "@shared/src/domain/model/flux";

export class FluxChargement extends Flux {

    constructor(
        nom: string,
        extension: string,
    ) {
        super(nom, extension);
    }
}
