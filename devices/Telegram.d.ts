import { Device } from 'vrack2-core';
declare class Telegram extends Device {
    description(): string;
    checkOptions(): {
        chatID: import("vrack2-core/lib/validator/types/NumberType").default;
        botapi: import("vrack2-core/lib/validator/types/StringType").default;
        parse_mode: import("vrack2-core/lib/validator/types/StringType").default;
    };
    inputs(): {
        message: import("vrack2-core/lib/ports/StandartPort").default;
    };
    inputMessage(message: string): void;
}
export = Telegram;
