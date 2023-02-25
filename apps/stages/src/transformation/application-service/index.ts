import { Module } from "@nestjs/common";

import { Shared } from "@shared/src";
import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { DateService } from "@shared/src/date.service";
import { Pays } from "@shared/src/pays";

import { TransformerFluxJobteaser } from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import { TransformerFluxStagefrCompresse } from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import { TransformerFluxStagefrDecompresse } from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import {
	Convertir as ConvertirJobteaser,
} from "@stages/src/transformation/domain/service/jobteaser/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import {
	Convertir as ConvertirStagefrCompresse,
} from "@stages/src/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import {
	Convertir as ConvertirStagefrDecompresse,
} from "@stages/src/transformation/domain/service/stagefr-decompresse/convertir.domain-service";
import { Gateways } from "@stages/src/transformation/infrastructure/gateway";

@Module({
	imports: [Gateways, Shared],
	providers: [
		{
			provide: ConvertirJobteaser,
			inject: [DateService, "AssainisseurDeTexte", "Pays"],
			useFactory: (dateService: DateService, assainisseurDeTexte: AssainisseurDeTexte, pays: Pays): ConvertirJobteaser => {
				return new ConvertirJobteaser(dateService, assainisseurDeTexte, pays);
			},
		},
		{
			provide: ConvertirStagefrCompresse,
			inject: [DateService, "AssainisseurDeTexte"],
			useFactory: (dateService: DateService, assainisseurDeTexte: AssainisseurDeTexte): ConvertirStagefrCompresse => {
				return new ConvertirStagefrCompresse(dateService, assainisseurDeTexte);
			},
		},
		{
			provide: ConvertirStagefrDecompresse,
			inject: [DateService, "AssainisseurDeTexte"],
			useFactory: (dateService: DateService, assainisseurDeTexte: AssainisseurDeTexte): ConvertirStagefrDecompresse => {
				return new ConvertirStagefrDecompresse(dateService, assainisseurDeTexte);
			},
		},
		{
			provide: TransformerFluxJobteaser,
			inject: ["OffreDeStageRepository", ConvertirJobteaser],
			useFactory: (offreDeStageRepository: OffreDeStageRepository, convertirOffreDeStage: ConvertirJobteaser): TransformerFluxJobteaser => {
				return new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);
			},
		},
		{
			provide: TransformerFluxStagefrCompresse,
			inject: ["OffreDeStageRepository", ConvertirStagefrCompresse],
			useFactory: (offreDeStageRepository: OffreDeStageRepository, convertirOffreDeStage: ConvertirStagefrCompresse): TransformerFluxStagefrCompresse => {
				return new TransformerFluxStagefrCompresse(offreDeStageRepository, convertirOffreDeStage);
			},
		},
		{
			provide: TransformerFluxStagefrDecompresse,
			inject: ["OffreDeStageRepository", ConvertirStagefrDecompresse],
			useFactory: (offreDeStageRepository: OffreDeStageRepository, convertirOffreDeStage: ConvertirStagefrDecompresse): TransformerFluxStagefrDecompresse => {
				return new TransformerFluxStagefrDecompresse(offreDeStageRepository, convertirOffreDeStage);
			},
		},
	],
	exports: [TransformerFluxJobteaser, TransformerFluxStagefrCompresse, TransformerFluxStagefrDecompresse],
})
export class Usecases {
}
