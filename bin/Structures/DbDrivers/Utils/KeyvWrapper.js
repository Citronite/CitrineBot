"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keyv = require("keyv");
class KeyvWrapper {
    constructor(...options) {
        this.kv = new Keyv(...options);
    }
    async create(key, value, ttl) {
        await this.kv.set(key, value, ttl);
    }
    async read(key) {
        return await this.kv.get(key);
    }
    async update(key, value, ttl) {
        await this.kv.set(key, value, ttl);
    }
    async delete(key) {
        await this.kv.delete(key);
    }
    async drop() {
        await this.kv.clear();
    }
}
exports.default = KeyvWrapper;
