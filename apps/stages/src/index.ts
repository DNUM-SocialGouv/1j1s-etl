import { Module } from "@nestjs/common";
import { Extraction } from "@stages/src/extraction";
import { Transformation } from "@stages/src/transformation";
import { Chargement } from "@stages/src/chargement";

@Module({
	exports: [
		Chargement,
		Extraction,
		Transformation,
	],
	imports: [
		Chargement,
		Extraction,
		Transformation,
	],
})
export class Stages {
}
