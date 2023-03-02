import { Configuration } from "@logements/src/chargement/infrastructure/configuration/configuration";
import { TaskLog } from "@logements/src/chargement/infrastructure/configuration/log.decorator";

import { Usecase } from "@shared/src/application-service/usecase";
import { Flux } from "@shared/src/domain/model/flux";
import { Task } from "@shared/src/infrastructure/task/task";

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
