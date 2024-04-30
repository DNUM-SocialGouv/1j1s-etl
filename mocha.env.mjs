// NOTE (BRUJ 29/04/2024): Le choix d'export global est lié à la montée de dépendence de chai en v5 cf https://github.com/chaijs/chai/discussions/1575#discussioncomment-8079250
import * as chai from "chai";

globalThis.chai = chai;

// these are for ts-node
process.env.NODE_ENV = "test";
process.env.TS_NODE_PROJECT = "tsconfig.json";
