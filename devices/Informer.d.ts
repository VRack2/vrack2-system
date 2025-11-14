import { Device } from 'vrack2-core';
declare class Informer extends Device {
    description(): string;
    checkOptions(): {
        devices: import("vrack2-core/lib/validator/types/ObjectType").default;
    };
    actions(): {
        information: import("vrack2-core/lib/actions/GlobalAction").default;
    };
    process(): void;
    actionInformation(): Promise<any>;
}
export = Informer;
