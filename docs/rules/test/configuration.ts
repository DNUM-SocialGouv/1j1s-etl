import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

chai.use(sinonChai);

export const expect = chai.expect;
export {
	sinon,
	StubbedType,
	stubInterface
};
