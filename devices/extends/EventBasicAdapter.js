"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vrack2_core_1 = require("vrack2-core");
const util_1 = __importDefault(require("util"));
/**
 * Класс устройства для переопределния
*/
class EventBasicAdapter extends vrack2_core_1.Device {
    checkOptions() {
        return {
            vars: vrack2_core_1.Rule.array()
                .default([
                'id', 'host', 'service', 'name', 'group',
                'description', 'event', 'device', 'deviceType',
                'data', 'trace', 'args', 'created'
            ])
                .description('Список переменных внутри объекта'),
            normalize: vrack2_core_1.Rule.array().default(['trace', 'args']).content(vrack2_core_1.Rule.string().description('Переменная для нормализации'))
                .description('Список переменных для нормализации (прим. Преобразует объект в строку)'),
            template: vrack2_core_1.Rule.string()
                .default('{host}.{name}({service}).{device}({deviceType}).{event}:\n{data}\n{trace}')
                .description('Шаблон строки для замены ({var} шаблон)'),
            replace: vrack2_core_1.Rule.array()
                .default([{
                    reg: "(?<=password:)( *|\\n*)( *|\\n*)'(.*?)'",
                    flags: 'gm',
                    replace: "''"
                }])
                .description('Список regexp выражений для замены')
        };
    }
    inputs() {
        return {
            'event': vrack2_core_1.Port.standart()
                .description('Вход события')
        };
    }
    /**
     * Инициализация регулярных выражений
     */
    process() {
        // Добавляет прямов в опции класс регекспов - нужно для оптимизации
        // поскольку набор классов не меняется, их можно создать один раз
        for (const reg of this.options.replace)
            reg.class = new RegExp(reg.reg, reg.flags);
    }
    /**
     * Обработчик входа event
     */
    inputEvent(event) {
        let str = this.options.template;
        for (const vr of this.options.vars) {
            if (this.options.normalize.indexOf(vr) !== -1) {
                str = str.replace(`{${vr}}`, this.normalize(event[vr]));
            }
            else {
                str = str.replace(`{${vr}}`, event[vr] || '');
            }
        }
        str = this.replaceLog(str);
        this.postEvent(str, event);
    }
    /**
     * Необходимо переопределить для своей логики
     *
     * @param str Строка преобразованная в текс
    */
    postEvent(str, event) {
    }
    /**
     * Преобразовывает любое значение в строку используя util.inspect
     *
     * @param trace
     * @returns {string} Преобразованный объект в строку
     */
    normalize(trace) {
        if (typeof trace === 'string')
            return trace;
        return util_1.default.inspect(trace, {
            showHidden: false,
            depth: null,
            compact: false
        });
    }
    /**
     * Проводит замену внутри готовой строки
     *
     * Удаляет например реальные строковые пароли
    */
    replaceLog(str) {
        for (const reg of this.options.replace)
            str = str.replace(reg.class, reg.replace);
        return str;
    }
}
exports.default = EventBasicAdapter;
