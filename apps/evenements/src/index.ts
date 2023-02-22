import { Module } from "@nestjs/common";

import { Chargement } from "@evenements/src/chargement";
import { Extraction } from "@evenements/src/extraction";
import { Transformation } from "@evenements/src/transformation";

@Module({
  imports: [Chargement, Extraction, Transformation],
  exports: [Chargement, Extraction, Transformation],
})
export class Evenements {
}
