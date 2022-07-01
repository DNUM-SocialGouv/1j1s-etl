import { Router } from "express";

export abstract class CommonRouter {
	abstract initializeRouter(): Router;
}
