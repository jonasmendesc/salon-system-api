import { Server } from "http";
import { v1 } from 'uuid';
import {Random, Entropy, charSet16} from 'entropy-string'

export const normalizePort = (val: number | string): number | string | boolean => {
    let port: number = (typeof val === 'string') ? parseInt(val) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

export const onError = (server: Server) => {
    return (error: NodeJS.ErrnoException): void => {
        let port: number | string = server.address().port;
        if (error.syscall !== 'listen') throw error;
        let bind = (typeof port === 'string') ? `pipe ${port}` : `port ${port}`;
        switch(error.code) {
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
    }
}

export const onListening = (server: Server) => {
    return (): void => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening at ${bind}...`);
    }
}


export const handlerError = (error: Error) => {
    let errorMessage : string = `${error.name}: ${error.message}`;
    return Promise.reject(new Error(errorMessage));
}

export const thowError = (condition: boolean, message: string) : void => {
  if(condition) throw new Error(message);
}

export const JWT_SECRET: string = process.env.JWT_SECRET;

export const ACCOUNT_EMAIL: string = process.env.ACCOUNT_EMAIL;

export const PASS_EMAIL: string = process.env.PASS_EMAIL;

export const generateIdUnique = (): string => {
    return v1();
}

export const truncade = (value : any): number => {
  value = value.toString();
  if(value.indexOf(".")> 0){
    value = value.slice(0, (value.indexOf("."))+3);
    return  Number(value);
  }
  return Number(value);
}