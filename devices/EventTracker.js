"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const node_os_1 = require("node:os");
const vrack2_core_1 = require("vrack2-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EventTracker extends vrack2_core_1.Device {
    constructor() {
        super(...arguments);
        this.eventRule = vrack2_core_1.Rule.object().fields({}).description('Объект события');
        this.eventsChannels = {
            'device.error': 'error',
            'device.notify': 'notify',
            'device.alert': 'alert',
            'device.terminal': 'terminal',
            'device.event': 'event'
        };
        this.hostname = (0, node_os_1.hostname)();
        this.defaultMeta = {
            name: 'No Name',
            group: 'No Group',
            description: 'No Description',
            system: false,
            autoStart: false,
            autoReload: false,
        };
    }
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'EventTracker.md')).toString('utf-8');
    }
    outputs() {
        // Порт для всех событий
        const op = {
            'event': vrack2_core_1.Port.standart().requirement(this.eventRule).description('Выход для всех событий')
        };
        // Отдельный порт для каждого события
        for (const en in this.eventsChannels)
            op['event.' + this.eventsChannels[en]] = vrack2_core_1.Port.standart()
                .requirement(this.eventRule)
                .description('Порт для события ' + this.eventsChannels[en]);
        return op;
    }
    process() {
        // Подписываемся на все каналы
        for (const channel in this.eventsChannels) {
            this.Container.on(channel, (data, args) => {
                const event = this.prepareEvent(data.device, data.data, data.trace, this.eventsChannels[channel], args);
                this.ports.output['event'].push(event);
                this.ports.output['event.' + this.eventsChannels[channel]].push(event);
            });
        }
    }
    prepareEvent(device, data, trace, eventType, args) {
        const meta = this.prepareMeta();
        return {
            id: this.makeHash(this.hostname + this.Container.id + eventType + device + data),
            host: this.hostname,
            service: this.Container.id,
            name: meta.name,
            group: meta.group,
            description: meta.description,
            event: eventType,
            device: device,
            deviceType: this.Container.devices[device].type,
            data, trace, args,
            created: Date.now()
        };
    }
    prepareMeta() {
        var _a;
        return Object.assign(this.defaultMeta, (_a = this.Container) === null || _a === void 0 ? void 0 : _a.meta);
    }
    makeHash(str) {
        return (0, node_crypto_1.createHash)('md5').update(str).digest('hex');
    }
}
exports.default = EventTracker;
