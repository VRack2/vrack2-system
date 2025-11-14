"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vrack2_core_1 = require("vrack2-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EventBasicAdapter_1 = __importDefault(require("./extends/EventBasicAdapter"));
class EventFileAdapter extends EventBasicAdapter_1.default {
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'EventFileAdapter.md')).toString('utf-8');
    }
    checkOptions() {
        return Object.assign(Object.assign({}, super.checkOptions()), { logDir: vrack2_core_1.Rule.string()
                .default('/var/log/vrack')
                .description('Путь до папки логов VRack') });
    }
    postEvent(str, event) {
        fs_1.default.appendFile(path_1.default.join(this.options.logDir, this.getLogName()), (new Date().toString()) + ' ' + str + '\n', 'utf8', (err) => { if (err)
            console.error('Ошибка записи в лог:', err); });
    }
    getLogName() {
        const d = new Date();
        const f = [this.tt(d.getFullYear()), this.tt(d.getMonth() + 1), this.tt(d.getDate())];
        return f.join('-') + '.log';
    }
    /**
     * Преобразует числа даты меньше 10 в строку из 2х символов,
     * так же если число >= 10 преобразует его в строку
     */
    tt(s) {
        return (s < 10) ? '0' + s : '' + s;
    }
}
exports.default = EventFileAdapter;
