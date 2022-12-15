import { DateTime } from "luxon";

export class DateService {
	public maintenant(): Date {
		return new Date();
	}

	public stringifyMaintenant(): string {
		return DateTime.now().toUTC(undefined, { keepLocalTime: true }).toISO();
	}

	public toIsoDateAvecDateEtHoraire(date: string, horaire: string): string {
		return DateTime.fromFormat(date+" "+horaire, "dd/MM/yyyy HH:mm").toFormat("yyyy-MM-dd'T'HH:mm:ss");
	}

	public toIsoDateAvecDate(date: string): string {
		return DateTime.fromFormat(date, "dd/MM/yyyy", { locale: "fr-FR", zone: "Europe/Paris" }).toUTC(undefined, { keepLocalTime: true }).toISO();
	}

	public toIsoDateFromFrenchFormatWithSeconds(date: string): string {
		return DateTime.fromFormat(date, "dd/MM/yyyy HH:mm:ss", { locale: "fr-FR", zone: "Europe/Paris" }).toUTC().toISO();
	}
}
