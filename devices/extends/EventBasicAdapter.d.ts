import IEvent from "./IEvent";
import { Device } from 'vrack2-core';
/**
 * Класс устройства для переопределния
*/
export default class EventBasicAdapter extends Device {
    checkOptions(): {
        vars: import("vrack2-core/lib/validator/types/ArrayType").default;
        normalize: import("vrack2-core/lib/validator/types/ArrayType").default;
        template: import("vrack2-core/lib/validator/types/StringType").default;
        replace: import("vrack2-core/lib/validator/types/ArrayType").default;
    };
    inputs(): {
        event: import("vrack2-core/lib/ports/StandartPort").default;
    };
    /**
     * Инициализация регулярных выражений
     */
    process(): void;
    /**
     * Обработчик входа event
     */
    inputEvent(event: IEvent): void;
    /**
     * Необходимо переопределить для своей логики
     *
     * @param str Строка преобразованная в текс
    */
    postEvent(str: string, event: IEvent): void;
    /**
     * Преобразовывает любое значение в строку используя util.inspect
     *
     * @param trace
     * @returns {string} Преобразованный объект в строку
     */
    protected normalize(trace: any): string;
    /**
     * Проводит замену внутри готовой строки
     *
     * Удаляет например реальные строковые пароли
    */
    protected replaceLog(str: string): string;
}
