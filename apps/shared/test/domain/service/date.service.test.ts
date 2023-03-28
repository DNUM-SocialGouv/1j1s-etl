import { expect, sinon, SinonFakeTimers } from "@test/library";

import { DateService } from "@shared/src/domain/service/date.service";

const maintenant = new Date("2022-01-01T00:00:00Z");
let clock: SinonFakeTimers;
let dateService: DateService;

describe("DateServiceTest", () => {
	before(() => {
		clock = sinon.useFakeTimers(maintenant);
		dateService = new DateService();
	});

	after(() => {
		clock.restore();
	});

	context("Lorsque je veux récupérer la date à un instant t", () => {
		it("retourne la date à l'instant t", () => {
			const result = dateService.maintenant();

			expect(result).to.eql(maintenant);
		});
	});

	context("Lorsque j'ai une date et un horaire au frenchi format", () => {
		it("retourne la date au format iso 8601", () => {
			const result = dateService.toIsoDateAvecDateEtHoraire("24/11/2022", "09:00");

			expect(result).to.eql("2022-11-24T09:00:00");
		});
	});
});
