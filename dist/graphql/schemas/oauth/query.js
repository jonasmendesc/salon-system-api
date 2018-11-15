"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenSchema_1 = require("../../oauth/tokens/tokenSchema");
const Query = `
    type Query {
        ${tokenSchema_1.tokenQueries}
    }
`;
exports.Query = Query;
