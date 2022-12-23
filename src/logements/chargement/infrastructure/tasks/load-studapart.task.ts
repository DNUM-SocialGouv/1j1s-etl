import { Task } from "@shared/infrastructure/task/task";
import { Usecase } from "@shared/usecase";
import { Configuration } from "@logements/chargement/configuration/configuration";
import { Flux } from "@shared/flux";
import { TaskLog } from "@logements/chargement/configuration/log.decorator";

export class LoadStudapartTask implements Task {

    private static readonly FLOW_NAME = "studapart";

    constructor(private readonly usecase: Usecase, private readonly configuration: Configuration) {
    }

    @TaskLog(LoadStudapartTask.FLOW_NAME)
    public async run(): Promise<void> {
        await this.usecase.executer(
            new Flux(
                this.configuration.STUDAPART.NAME,
                this.configuration.STUDAPART.EXTENSION,
            ),
        );
    }

}
