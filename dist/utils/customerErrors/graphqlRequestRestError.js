"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphqlRequestRestError extends Error {
    constructor(inputError) {
        super();
        this.code = inputError.code;
        this.message = inputError.messageError;
    }
}
exports.GraphqlRequestRestError = GraphqlRequestRestError;
