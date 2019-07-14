"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const KeyvWrapper_1 = __importDefault(require("./Utils/KeyvWrapper"));
class SQLiteKV {
    constructor() {
        this.type = 'SQLiteKV';
    }
    connect(name, path) {
        try {
            this[name] = new KeyvWrapper_1.default(`sqlite://${path_1.resolve(path)}`);
            return this[name];
        }
        catch (err) {
            throw err;
        }
    }
    disconnect(name) {
        delete this[name];
    }
}
exports.default = SQLiteKV;
