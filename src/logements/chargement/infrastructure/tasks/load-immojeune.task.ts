import { Task } from "@shared/infrastructure/task/task";
import { Usecase } from "@shared/usecase";
import { Configuration } from "@logements/chargement/configuration/configuration";
import { Flux } from "@shared/flux";
import { TaskLog } from "@logements/chargement/configuration/log.decorator";

export class LoadImmojeuneTask implements Task {

    private static readonly FLOW_NAME = "immojeune";

    constructor(private readonly usecase: Usecase, private readonly configuration: Configuration) {
    }

    @TaskLog(LoadImmojeuneTask.FLOW_NAME)
    public async run(): Promise<void> {
        await this.usecase.executer(
            new Flux(
                this.configuration.IMMOJEUNE.NAME,
                this.configuration.IMMOJEUNE.EXTENSION,
            ),
        );
    }

}
