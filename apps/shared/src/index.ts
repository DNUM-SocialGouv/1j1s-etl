import { Module } from "@nestjs/common";
import { DateService } from "@shared/src/date.service";

@Module({
	providers: [DateService],
	exports: [DateService],
})
export class SharedModule {
}
