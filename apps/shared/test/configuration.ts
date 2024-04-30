import { StubbedCallableType, StubbedType, stubCallable, stubInterface } from "@salesforce/ts-sinon";

import nock from "nock";
import sinon, {
	createStubInstance,
	SinonFakeTimers,
	SinonStubbedInstance,
	SinonStubbedMember,
	spy,
	StubbableType,
} from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
chai.use((chai, utils) => {
	utils.addMethod(chai.Assertion.prototype, 'rejectedWith', function (this, errorLike, errMsgMatcher, message) {
		if (!(this._obj instanceof Promise)) {
			throw 'La méthode utilisée n‘est pas une promesse'
		}

		const toto = this._obj.catch((e) => {
			if (errorLike instanceof RegExp || typeof errorLike === "string") {
				errMsgMatcher = errorLike;
				errorLike = null;
			} else if (errorLike && errorLike instanceof Error) {
				errorLikeName = errorLike.toString();
			} else if (typeof errorLike === "function") {
				errorLikeName = errorLike.name;
			} else {
				errorLike = null;
			}
		})


		let errorLikeName = null;
		const negate = utils.flag(this, "negate") || false;

		if (message !== undefined) {
			utils.flag(this, "message", message);
		}

		if (errorLike instanceof RegExp || typeof errorLike === "string") {
			errMsgMatcher = errorLike;
			errorLike = null;
		} else if (errorLike && errorLike instanceof Error) {
			errorLikeName = errorLike.toString();
		} else if (typeof errorLike === "function") {
			errorLikeName = checkError.getConstructorName(errorLike);
		} else {
			errorLike = null;
		}
		const everyArgIsDefined = Boolean(errorLike && errMsgMatcher);

		let matcherRelation = "including";
		if (errMsgMatcher instanceof RegExp) {
			matcherRelation = "matching";
		}

		const derivedPromise = getBasePromise(this).then(
			value => {
				let assertionMessage = null;
				let expected = null;

				if (errorLike) {
					assertionMessage = "expected promise to be rejected with #{exp} but it was fulfilled with #{act}";
					expected = errorLikeName;
				} else if (errMsgMatcher) {
					assertionMessage = `expected promise to be rejected with an error ${matcherRelation} #{exp} but ` +
						`it was fulfilled with #{act}`;
					expected = errMsgMatcher;
				}

				assertIfNotNegated(this, assertionMessage, { expected, actual: value });
				return value;
			},
			reason => {
				const errorLikeCompatible = errorLike && (errorLike instanceof Error ?
					checkError.compatibleInstance(reason, errorLike) :
					checkError.compatibleConstructor(reason, errorLike));

				const errMsgMatcherCompatible = errMsgMatcher && checkError.compatibleMessage(reason, errMsgMatcher);

				const reasonName = getReasonName(reason);

				if (negate && everyArgIsDefined) {
					if (errorLikeCompatible && errMsgMatcherCompatible) {
						this.assert(true,
							null,
							"expected promise not to be rejected with #{exp} but it was rejected " +
							"with #{act}",
							errorLikeName,
							reasonName);
					}
				} else {
					if (errorLike) {
						this.assert(errorLikeCompatible,
							"expected promise to be rejected with #{exp} but it was rejected with #{act}",
							"expected promise not to be rejected with #{exp} but it was rejected " +
							"with #{act}",
							errorLikeName,
							reasonName);
					}

					if (errMsgMatcher) {
						this.assert(errMsgMatcherCompatible,
							`expected promise to be rejected with an error ${matcherRelation} #{exp} but got ` +
							`#{act}`,
							`expected promise not to be rejected with an error ${matcherRelation} #{exp}`,
							errMsgMatcher,
							checkError.getMessage(reason));
					}
				}

				return reason;
			},
		);

		module.exports.transferPromiseness(this, derivedPromise);
		return this;
	})

	utils.addProperty(chai.Assertion.prototype, 'rejected', function () {
		const derivedPromise = getBasePromise(this).then(
			value => {
				assertIfNotNegated(this,
					"expected promise to be rejected but it was fulfilled with #{act}",
					{ actual: value });
				return value;
			},
			reason => {
				assertIfNegated(this,
					"expected promise not to be rejected but it was rejected with #{act}",
					{ actual: getReasonName(reason) });

				// Return the reason, transforming this into a fulfillment, to allow further assertions, e.g.
				// `promise.should.be.rejected.and.eventually.equal("reason")`.
				return reason;
			},
		);

		module.exports.transferPromiseness(this, derivedPromise);
		return this;
	})
})

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
export { nock, sinon, SinonFakeTimers, spy, StubbedType, stubInterface, StubbedCallableType, stubCallable };
