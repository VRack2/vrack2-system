export default interface IEvent {
    id: string;
    host: string;
    service: string;
    name: string;
    group: string;
    description: string;
    event: 'terminal' | 'notify' | 'error' | 'alert' | 'event';
    device: string;
    deviceType: string;
    data: any;
    trace: any;
    args: any;
    created: number;
}