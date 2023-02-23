import { Module } from "@nestjs/common";

import {
	TransformerFluxImmojeune,
} from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import { Gateways } from "@logements/src/transformation/configuration/gateway.container";
import {
	Convertir as ConvertirImmojeune,
} from "@logements/src/transformation/domain/service/immojeune/convertir.domain-service";
import {
	Convertir as ConvertirStudapart,
} from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";

import { Shared } from "@shared/src";
import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { DateService } from "@shared/src/date.service";

@Module({
	imports: [Gateways, Shared],
	providers: [
		{
			provide: ConvertirImmojeune,
			inject: ["AssainisseurDeTexte", DateService],
			useFactory: (
				assainisseurDeTexte: AssainisseurDeTexte,
				dateService: DateService,
			): ConvertirImmojeune => new ConvertirImmojeune(assainisseurDeTexte, dateService),
		}, {
			provide: ConvertirStudapart,
			inject: ["AssainisseurDeTexte", DateService],
			useFactory: (
				assainisseurDeTexte: AssainisseurDeTexte,
				dateService: DateService,
			): ConvertirStudapart => new ConvertirStudapart(assainisseurDeTexte, dateService),
		},
		TransformerFluxImmojeune,
		TransformerFluxStudapart,
	],
	exports: [TransformerFluxImmojeune, TransformerFluxStudapart],
})
export class Usecases {
}
