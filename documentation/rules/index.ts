import { NoCrossContextImport } from "./no-cross-context-import";
import { NoCrossSubContextImport } from "./no-cross-sub-context-import";
import { NoOnionArchitectureViolation } from "./no-onion-architecture-violation";

module.exports = {
	rules: {
		"no-cross-context-import": {
			create: NoCrossContextImport.create,
			meta: {
				docs: {
					description: "Avoid cross-context import which can lead to strong coupling across the application",
					recommended: "error",
				},
				type: "problem",
			},
		},
		"no-cross-subcontext-import": {
			create: NoCrossSubContextImport.create,
			meta: {
				docs: {
					description: "Avoid cross-subcontext import which can lead to strong coupling across the application",
					recommended: "error",
				},
				type: "problem",
			},
		},
		"no-onion-architecture-violation": {
			create: NoOnionArchitectureViolation.create,
			meta: {
				docs: {
					description: "Enforces software design rules based on Onion architecture",
					recommended: "error",
				},
				type: "problem",
			},
		}
	},
	configs: {
		architecture: {
			plugins: ["@1j1s"],
			rules: {
				"@1j1s/no-cross-context-import": "error",
				"@1j1s/no-cross-subcontext-import": "error",
				"@1j1s/no-onion-architecture-violation": "error",
			},
		},
	},
};
