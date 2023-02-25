import { Module } from "@nestjs/common";

import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import { Convertir } from "@evenements/src/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { Gateways } from "@evenements/src/transformation/infrastructure/gateway";

import { Shared } from "@shared/src";
import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { DateService } from "@shared/src/date.service";

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
