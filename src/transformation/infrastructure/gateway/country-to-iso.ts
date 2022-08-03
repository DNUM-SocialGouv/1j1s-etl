import countries from "i18n-iso-countries";

import { Pays } from "@shared/pays";

export class CountryToIso implements Pays {
	versFormatISOAlpha2(nomDePays: string): string {
		return countries.getAlpha2Code(nomDePays, "en");
	}
}
