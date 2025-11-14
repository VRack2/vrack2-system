"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const vrack2_core_1 = require("vrack2-core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
vrack2_core_1.ErrorManager.register('vrack2-system.Informer', '0BSOCDFG9', 'V2SYSTEM_DEVICE_NF', 'Device on service not found', {
    device: vrack2_core_1.Rule.string().description('Название устройства которое не найдено')
});
class Informer extends vrack2_core_1.Device {
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'Informer.md')).toString('utf-8');
    }
    // Параметры
    checkOptions() {
        return {
            devices: vrack2_core_1.Rule.object()
                .default({})
                .example({
                Informer: { langName: 'Информер дашборда' },
            })
                .description('Дополнительно информация об устройствах в формате `{ "deviceId": { "additional": "info" } }`'),
        };
    }
    // Экшены
    actions() {
        return {
            information: vrack2_core_1.Action.global().description('Получение служебной информации об устройствах'),
        };
    }
    // Инициализация / проверка существования устройств
    process() {
        for (const name in this.options.devices) {
            if (this.Container.devices[name])
                continue;
            this.terminate(vrack2_core_1.ErrorManager.make('V2SYSTEM_DEVICE_NF', { device: name }), 'process');
        }
    }
    // Обработчик экшена
    actionInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.devices;
        });
    }
}
module.exports = Informer;
