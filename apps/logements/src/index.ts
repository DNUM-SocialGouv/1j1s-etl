import { Module } from "@nestjs/common";

import { Chargement } from "@logements/src/chargement";
import { Extraction } from "@logements/src/extraction";
import { Transformation } from "@logements/src/transformation";

@Module({
	imports: [Chargement, Extraction, Transformation],
	exports: [Chargement, Extraction, Transformation],
})
export class Logements {
}
