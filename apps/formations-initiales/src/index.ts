import { Module } from "@nestjs/common";

import { Extraction } from "@formations-initiales/src/extraction";
import { Transformation } from "@formations-initiales/src/transformation/infrastructure";

@Module({
  imports: [Extraction, Transformation],
  exports: [Extraction, Transformation],
})
export class FormationsInitiales {
}
