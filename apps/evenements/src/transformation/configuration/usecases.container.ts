import { Module } from "@nestjs/common";

import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { Convertir } from "@evenements/src/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { DateService } from "@shared/src/date.service";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import { Gateways } from "@evenements/src/transformation/configuration/gateways.container";
import { Shared } from "@shared/src";
import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";

@Module({
	imports: [Gateways, Shared],
	providers: [{
		provide: Convertir,
		inject: [DateService, "AssainisseurDeTexte"],
		useFactory: (dateService: DateService, assainisseurDeTexte: AssainisseurDeTexte): Convertir => {
			return new Convertir(dateService, assainisseurDeTexte);
		},
	}, {
		provide: TransformerFluxTousMobilises,
		inject: [
			"EvenementsRepository",
			Convertir,
		],
		useFactory: (evenementsRepository: EvenementsRepository, convertirDomainService: Convertir): TransformerFluxTousMobilises => {
			return new TransformerFluxTousMobilises(evenementsRepository, convertirDomainService);
		},
	}],
	exports: [TransformerFluxTousMobilises],
})
export class Usecases {
}
