"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vrack2_core_1 = require("vrack2-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EventBasicAdapter_1 = __importDefault(require("./extends/EventBasicAdapter"));
class EventTextAdapter extends EventBasicAdapter_1.default {
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'EventFileAdapter.md')).toString('utf-8');
    }
    outputs() {
        return {
            'text': vrack2_core_1.Port.standart()
                .description('Выход форматированного текста')
        };
    }
    postEvent(str, event) {
        this.ports.output['text'].push(str);
    }
}
module.exports = EventTextAdapter;
