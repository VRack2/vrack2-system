import { createHash } from "node:crypto";
import { hostname } from "node:os";
import { Device, Port, Rule, BasicPort } from "vrack2-core";

import fs from 'fs';
import path from "path";

export default class EventTracker extends Device {

  description(): string {
      return fs.readFileSync(path.join(path.dirname(__dirname), 'docs','EventTracker.md')).toString('utf-8')
  }

  outputs(): { [key: string]: BasicPort; } {
    // Порт для всех событий
    const op: { [key: string]: BasicPort; } = {
      'event': Port.standart().requirement(this.eventRule).description('Выход для всех событий')
    }

    // Отдельный порт для каждого события
    for (const en in this.eventsChannels) op['event.' + this.eventsChannels[en]] = Port.standart()
      .requirement(this.eventRule)
      .description('Порт для события ' + this.eventsChannels[en])
    return op
  }

  eventRule = Rule.object().fields({
  }).description('Объект события')

  eventsChannels: { [key: string]: string } = {
    'device.error': 'error',
    'device.notify': 'notify',
    'device.alert': 'alert',
    'device.terminal': 'terminal',
    'device.event': 'event'
  }

  hostname = hostname()

  protected defaultMeta = {
    name: 'No Name',
    group: 'No Group',
    description: 'No Description',
    system: false,
    autoStart: false,
    autoReload: false,
  }


  process() {
    // Подписываемся на все каналы
    for (const channel in this.eventsChannels) {
      this.Container.on(channel, (data: { device: string; data: string; trace: any; }, args: any[]) => {
        const event = this.prepareEvent(data.device, data.data, data.trace, this.eventsChannels[channel], args)
        this.ports.output['event'].push(event)
        this.ports.output['event.' + this.eventsChannels[channel]].push(event)
      })
    }
  }

  prepareEvent(device: string, data: string, trace: any, eventType: string, args: any[]) {
    const meta = this.prepareMeta()
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
    }
  }

  prepareMeta(){
    return Object.assign(this.defaultMeta, this.Container?.meta)
  } 

  protected makeHash(str: string){
     return createHash('md5').update(str).digest('hex')
  }
}