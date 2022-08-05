import countries from "i18n-iso-countries";

import { Pays } from "@shared/pays";

export class CountryToIso implements Pays {
	static DEFAULT_LANGUAGE = "en";

	versFormatISOAlpha2(nomDePaysComplet: string): string {
		return countries.getAlpha2Code(nomDePaysComplet, CountryToIso.DEFAULT_LANGUAGE);
	}
}
