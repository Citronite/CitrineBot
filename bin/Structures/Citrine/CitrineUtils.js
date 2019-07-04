"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DjsUtils_1 = __importDefault(require("../Utils/DjsUtils"));
const Formatter_1 = __importDefault(require("../Utils/Formatter"));
class CitrineUtils {
    constructor() {
        this.djs = new DjsUtils_1.default();
        this.format = new Formatter_1.default();
    }
}
exports.default = CitrineUtils;
