"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http = require("http");
const models_1 = require("./models");
const util_1 = require("./utils/util");
const server = http.createServer(app_1.default);
const port = util_1.normalizePort(process.env.PORT || 3000);
models_1.default.sequelize.sync().then(() => {
    server.listen(port);
    server.on('error', util_1.onError(server));
    server.on('listening', util_1.onListening(server));
});
