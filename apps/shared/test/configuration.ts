import { StubbedCallableType, StubbedType, stubCallable, stubInterface } from "@salesforce/ts-sinon";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import nock from "nock";
import sinon, { createStubInstance, SinonStubbedInstance, SinonStubbedMember, spy, StubbableType } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
chai.use(chaiAsPromised);

export type StubbedClass<T> = SinonStubbedInstance<T> & T

export function stubClass<T>(
	constructor: StubbableType<T>,
	overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> },
): StubbedClass<T> {
	const stub = createStubInstance<T>(constructor, overrides);
	return stub as unknown as StubbedClass<T>;
}

export const expect = chai.expect;
export const assert = chai.assert;
export { nock, sinon, spy, StubbedType, stubInterface, StubbedCallableType, stubCallable };
