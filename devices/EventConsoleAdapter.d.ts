import IEvent from "./extends/IEvent";
import EventBasicAdapter from './extends/EventBasicAdapter';
export default class EventConsoleAdapter extends EventBasicAdapter {
    description(): string;
    checkOptions(): {
        vars: import("vrack2-core/lib/validator/types/ArrayType").default;
        normalize: import("vrack2-core/lib/validator/types/ArrayType").default;
        template: import("vrack2-core/lib/validator/types/StringType").default;
        replace: import("vrack2-core/lib/validator/types/ArrayType").default;
    };
    postEvent(str: string, event: IEvent): void;
}
