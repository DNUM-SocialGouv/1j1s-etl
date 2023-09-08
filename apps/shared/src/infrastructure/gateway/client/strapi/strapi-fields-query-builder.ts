import { StrapiQueryParams } from "@shared/src/infrastructure/gateway/client/strapi/strapi-http-client";

export class StrapiFieldsQueryBuilder {
	static build(fieldsName: string[]): StrapiQueryParams {
		return fieldsName
			.map((field, index) => {
				const propertyName = `fields[${index}]`;
				return { [propertyName]: field };
			})
			.reduce((accumulator, currentValue) => ({ ...accumulator, ...currentValue }), {});
	}
}
