"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapWrapper {
    constructor() {
        this.map = new Map();
    }
    async create(key, value) {
        this.map.set(key, value);
    }
    async read(key) {
        return this.map.get(key);
    }
    async update(key, value) {
        this.map.set(key, value);
    }
    async delete(key) {
        this.map.delete(key);
    }
    async drop() {
        this.map.clear();
    }
}
exports.default = MapWrapper;
