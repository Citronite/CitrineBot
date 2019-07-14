"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapWrapper_1 = __importDefault(require("./Utils/MapWrapper"));
class Memory {
    constructor() {
        this.type = 'Memory';
    }
    connect(name) {
        try {
            this[name] = new MapWrapper_1.default();
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
exports.default = Memory;
