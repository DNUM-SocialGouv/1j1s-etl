import cron from "cron";

const helloWorldCron = new cron.CronJob({
	cronTime: "0 */1 * * *",
	onTick: (): void => console.info("Hello World !"),
	runOnInit: true,
	start: true,
	timeZone: "Europe/Paris"
});
