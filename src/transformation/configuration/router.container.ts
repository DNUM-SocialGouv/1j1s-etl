import { CommonRouter } from "../../shared/route/router";
import { TransformationRouter } from "../infrastructure/route";
import { ControllerContainer } from "../infrastructure/controller";

export function createRouters(controllerContainer: ControllerContainer): Array<CommonRouter> {
	return [new TransformationRouter(controllerContainer)];
}
