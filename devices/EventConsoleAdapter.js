"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EventBasicAdapter_1 = __importDefault(require("./extends/EventBasicAdapter"));
class EventConsoleAdapter extends EventBasicAdapter_1.default {
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'EventConsoleAdapter.md')).toString('utf-8');
    }
    checkOptions() {
        return Object.assign({}, super.checkOptions());
    }
    postEvent(str, event) {
        // Отправка в соответствующий поток вывода в зависимости от типа события
        if (event.event === 'alert')
            console.error(str);
        if (event.event === 'error')
            console.error(str);
        if (event.event === 'event')
            console.info(str);
        if (event.event === 'notify')
            console.info(str);
        if (event.event === 'terminal')
            console.log(str);
    }
}
exports.default = EventConsoleAdapter;
