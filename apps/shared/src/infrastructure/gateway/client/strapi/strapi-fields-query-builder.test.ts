import { expect } from "@test/library";

import { StrapiFieldsQueryBuilder } from "@shared/src/infrastructure/gateway/client/strapi/strapi-fields-query-builder";

describe("StrapiFieldsQueryBuilder", () => {
	it("construit un objet query contenant les champs demandés", () => {
		// GIVEN
		const fieldsName = ["id", "slug"];

		// WHEN
		const fieldsQuery = StrapiFieldsQueryBuilder.build(fieldsName);

		// THEN
		expect(fieldsQuery).to.deep.equal({
			"fields[0]": "id",
			"fields[1]": "slug",
		});
	});
});
