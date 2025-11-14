import { Device, BasicPort } from "vrack2-core";
export default class EventTracker extends Device {
    description(): string;
    outputs(): {
        [key: string]: BasicPort;
    };
    eventRule: import("vrack2-core/lib/validator/types/ObjectType").default;
    eventsChannels: {
        [key: string]: string;
    };
    hostname: string;
    protected defaultMeta: {
        name: string;
        group: string;
        description: string;
        system: boolean;
        autoStart: boolean;
        autoReload: boolean;
    };
    process(): void;
    prepareEvent(device: string, data: string, trace: any, eventType: string, args: any[]): {
        id: string;
        host: string;
        service: string;
        name: string;
        group: string;
        description: string;
        event: string;
        device: string;
        deviceType: string;
        data: string;
        trace: any;
        args: any[];
        created: number;
    };
    prepareMeta(): {
        name: string;
        group: string;
        description: string;
        system: boolean;
        autoStart: boolean;
        autoReload: boolean;
    } & {
        [key: string]: any;
    };
    protected makeHash(str: string): string;
}
