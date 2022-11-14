import countries from "i18n-iso-countries";

import { Pays } from "@shared/pays";

export class CountryToIso implements Pays {
	private static DEFAULT_LANGUAGE = "en";

	public versFormatISOAlpha2(nomDePaysComplet: string): string {
		return countries.getAlpha2Code(nomDePaysComplet, CountryToIso.DEFAULT_LANGUAGE);
	}
}
