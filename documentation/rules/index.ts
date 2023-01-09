import { NoCrossContextImportRule } from "./no-cross-context-import";

module.exports = {
	rules: {
		"no-cross-context-import": {
			create: NoCrossContextImportRule.create,
			meta: {
				docs: {
					description: "Avoid cross-context import which can lead to strong coupling across the application",
					recommended: "error",
				},
				type: "problem",
			},
		},
	},
	configs: {
		architecture: {
			plugins: ["@1j1s"],
			rules: {
				"@1j1s/no-cross-context-import": "error",
			},
		},
	},
};
