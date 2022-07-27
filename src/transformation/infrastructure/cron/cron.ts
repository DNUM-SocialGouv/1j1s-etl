import { CronJob } from "cron";

export interface Cron {
	init(): CronJob;
}
