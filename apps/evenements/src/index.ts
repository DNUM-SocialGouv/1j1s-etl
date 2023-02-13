import { Chargement } from "@evenements/src/chargement";
import { Extraction } from "@evenements/src/extraction";
import { Transformation } from "@evenements/src/transformation";
import { Module } from "@nestjs/common";

@Module({
  imports: [Chargement, Extraction, Transformation],
  exports: [Chargement, Extraction, Transformation],
})
export class Evenements {
}
