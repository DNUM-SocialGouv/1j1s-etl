import { Module } from "@nestjs/common";

import { Shared } from "@shared/src";

@Module({
    imports: [ Shared ],
})
export class Maintenance {
}
