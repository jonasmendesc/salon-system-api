"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
exports.normalizePort = (val) => {
    let port = (typeof val === 'string') ? parseInt(val) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
};
exports.onError = (server) => {
    return (error) => {
        let port = server.address().port;
        if (error.syscall !== 'listen')
            throw error;
        let bind = (typeof port === 'string') ? `pipe ${port}` : `port ${port}`;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
};
exports.onListening = (server) => {
    return () => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening at ${bind}...`);
    };
};
exports.handlerError = (error) => {
    let errorMessage = `${error.name}: ${error.message}`;
    return Promise.reject(new Error(errorMessage));
};
exports.thowError = (condition, message) => {
    if (condition)
        throw new Error(message);
};
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ACCOUNT_EMAIL = process.env.ACCOUNT_EMAIL;
exports.PASS_EMAIL = process.env.PASS_EMAIL;
exports.generateIdUnique = () => {
    return uuid_1.v1();
};
exports.truncade = (value) => {
    value = value.toString();
    if (value.indexOf(".") > 0) {
        value = value.slice(0, (value.indexOf(".")) + 3);
        return Number(value);
    }
    return Number(value);
};
