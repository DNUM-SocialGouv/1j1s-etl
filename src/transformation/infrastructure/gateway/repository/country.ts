import countries from "i18n-iso-countries";

import { ConvertisseurPays } from "@shared/convertisseur-pays";

export class Country implements ConvertisseurPays {
	versFormatISOAlpha2(nomDePays: string): string {
		return countries.getAlpha2Code(nomDePays, "en");
	}
}
