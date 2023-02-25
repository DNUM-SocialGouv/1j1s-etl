import { Module } from "@nestjs/common";

import {
	TransformerFluxImmojeune,
} from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import {
	AnnonceDeLogementRepository,
} from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import {
	Convertir as ConvertirImmojeune,
} from "@logements/src/transformation/domain/service/immojeune/convertir.domain-service";
import {
	Convertir as ConvertirStudapart,
} from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";
import { Gateways } from "@logements/src/transformation/infrastructure/gateway";

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
		{
			provide: TransformerFluxImmojeune,
			inject: [ConvertirImmojeune, "AnnonceDeLogementRepository"],
			useFactory: (convertir: ConvertirImmojeune, annonceDeLogementRepository: AnnonceDeLogementRepository): TransformerFluxImmojeune => {
				return new TransformerFluxImmojeune(annonceDeLogementRepository, convertir);
			},
		},
		{
			provide: TransformerFluxStudapart,
			inject: [ConvertirStudapart, "AnnonceDeLogementRepository"],
			useFactory: (convertir: ConvertirStudapart, annonceDeLogementRepository: AnnonceDeLogementRepository): TransformerFluxStudapart => {
				return new TransformerFluxStudapart(annonceDeLogementRepository, convertir);
			},
		},
	],
	exports: [TransformerFluxImmojeune, TransformerFluxStudapart],
})
export class Usecases {
}
