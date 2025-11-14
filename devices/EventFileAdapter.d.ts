import IEvent from "./extends/IEvent";
import EventBasicAdapter from "./extends/EventBasicAdapter";
export default class EventFileAdapter extends EventBasicAdapter {
    description(): string;
    checkOptions(): {
        logDir: import("vrack2-core/lib/validator/types/StringType").default;
        vars: import("vrack2-core/lib/validator/types/ArrayType").default;
        normalize: import("vrack2-core/lib/validator/types/ArrayType").default;
        template: import("vrack2-core/lib/validator/types/StringType").default;
        replace: import("vrack2-core/lib/validator/types/ArrayType").default;
    };
    postEvent(str: string, event: IEvent): void;
    getLogName(): string;
    /**
     * Преобразует числа даты меньше 10 в строку из 2х символов,
     * так же если число >= 10 преобразует его в строку
     */
    tt(s: number): string;
}
