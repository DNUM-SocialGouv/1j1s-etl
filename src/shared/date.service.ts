import { DateTime } from "luxon";

export class DateService {
	public maintenant(): Date {
		return new Date();
	}

	public toIsoDate(date: string, horaire: string): string {
		return DateTime.fromFormat(date+" "+horaire, "dd/MM/yyyy HH:mm").toFormat("yyyy-MM-dd'T'HH:mm:ss");
	}

	public toIsoDateFromFrenchFormatWithSeconds(date: string): string {
		return DateTime.fromFormat(date, "dd/MM/yyyy HH:mm:ss", { locale: "fr-FR", zone: "Europe/Paris" }).toUTC().toISO();
	}
}
