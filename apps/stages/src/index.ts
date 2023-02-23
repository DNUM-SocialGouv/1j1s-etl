import { Module } from "@nestjs/common";

import { Chargement } from "@stages/src/chargement";
import { Extraction } from "@stages/src/extraction";
import { Transformation } from "@stages/src/transformation";

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
