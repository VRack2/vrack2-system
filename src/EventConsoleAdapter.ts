import IEvent from "./extends/IEvent";
import fs from 'fs';
import path from "path";

import EventBasicAdapter from './extends/EventBasicAdapter'

export default class EventConsoleAdapter extends EventBasicAdapter {
  
  description(): string {
      return fs.readFileSync(path.join(path.dirname(__dirname), 'docs','EventConsoleAdapter.md')).toString('utf-8')
  }

  checkOptions() {
    return {
      ...super.checkOptions()
    }
  }

  public postEvent(str: string, event: IEvent): void {
    // Отправка в соответствующий поток вывода в зависимости от типа события
    if (event.event === 'alert') console.error(str);
    if (event.event === 'error') console.error(str);
    if (event.event === 'event') console.info(str);
    if (event.event === 'notify') console.info(str);
    if (event.event === 'terminal') console.log(str);
  }
}