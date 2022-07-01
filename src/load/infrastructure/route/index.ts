import { CommonRouter } from "../../../shared/route/router";
import { Router } from "express";
import { ControllerContainer } from "../controller";

export class LoadRouter extends CommonRouter {
	constructor(private readonly controllers: ControllerContainer) {
		super();
	}

	initializeRouter(): Router {
		const router = Router();
		return router;
	}
}
