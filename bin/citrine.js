"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CitrineClient_1 = __importDefault(require("./Structures/CitrineClient"));
const options = {
    disableEveryone: true,
    disabledEvents: ['TYPING_START'],
    defaultChips: ['all'],
    DbProvider: 'Memory'
};
const citrine = new CitrineClient_1.default(options);
(async function main() {
    try {
        await citrine.launch();
    }
    catch (_) {
        process.exit(1);
    }
})();
process.on('uncaughtException', citrine.logger.error);
process.on('unhandledRejection', citrine.logger.error);
process.on('exit', code => citrine.logger.warn(`Process exited with code ${code}`));
