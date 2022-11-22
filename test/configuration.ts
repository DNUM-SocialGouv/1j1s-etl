import chai from "chai";
import sinonChai from "sinon-chai";
import { createStubInstance, SinonStubbedInstance, SinonStubbedMember, StubbableType } from "sinon";
import chaiAsPromised from "chai-as-promised";

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
