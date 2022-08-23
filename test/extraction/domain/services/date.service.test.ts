import { DateService } from "@extraction/domain/services/date.service";
import { expect } from "@test/configuration";
import sinon from "sinon";

const maintenant = new Date("2022-01-01T00:00:00Z");
let clock: sinon.SinonFakeTimers;
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
});
