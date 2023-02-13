import { Chargement } from "@logements/src/chargement";
import { Extraction } from "@logements/src/extraction";
import { Transformation } from "@logements/src/transformation";
import { Module } from "@nestjs/common";

@Module({
	imports: [Chargement, Extraction, Transformation],
	exports: [Chargement, Extraction, Transformation],
})
export class Logements {
}
