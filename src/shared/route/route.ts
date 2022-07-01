import { Router } from "express";
import { Controller } from "../controller/controller";

export abstract class CommonRoute<T extends Controller> {
	abstract register(router: Router, controller: T): void;
}
