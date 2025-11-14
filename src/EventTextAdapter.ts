import { Port } from 'vrack2-core'

import fs from 'fs'
import path from 'path'
import IEvent from './extends/IEvent'
import EventBasicAdapter from './extends/EventBasicAdapter'


class EventTextAdapter extends EventBasicAdapter {

  description(): string {
    return fs.readFileSync(path.join(path.dirname(__dirname), 'docs', 'EventFileAdapter.md')).toString('utf-8')
  }

  outputs() {
    return {
      'text': Port.standart()
        .description('Выход форматированного текста')
    };
  }

  public postEvent(str: string, event: IEvent): void {
    this.ports.output['text'].push(str);
  }
}

module.exports = EventTextAdapter;