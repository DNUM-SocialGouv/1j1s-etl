import { Module } from "@nestjs/common";

import { Chargement } from "@formations-initiales/src/chargement";
import { Extraction } from "@formations-initiales/src/extraction";
import { Transformation } from "@formations-initiales/src/transformation";

@Module({
  imports: [Extraction, Transformation, Chargement],
  exports: [Extraction, Transformation, Chargement],
})
export class FormationsInitiales {
}
