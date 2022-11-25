import { DateTime } from "luxon";

export class DateService {
	public maintenant(): Date {
		return new Date();
	}

	public toIsoDate(date: string, horaire: string): string {
		return DateTime.fromFormat(date+" "+horaire, "dd/MM/yyyy hh:mm").toJSDate().toISOString();
	}
}
