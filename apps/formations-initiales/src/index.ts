import { Module } from "@nestjs/common";

import { Extraction } from "./extraction";

@Module({
  imports: [Extraction],
  exports: [Extraction],
})
export class FormationsInitiales {
}
