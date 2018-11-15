"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenSchema_1 = require("../../oauth/tokens/tokenSchema");
const Mutation = `
    type Mutation {
        ${tokenSchema_1.tokenMutations}
    }
`;
exports.Mutation = Mutation;
