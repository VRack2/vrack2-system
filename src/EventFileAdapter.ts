import IEvent from "./extends/IEvent";

import { Rule } from 'vrack2-core'

import fs from 'fs'
import path from 'path'
import EventBasicAdapter from "./extends/EventBasicAdapter";

export default class EventFileAdapter extends EventBasicAdapter {

  description(): string {
    return fs.readFileSync(path.join(path.dirname(__dirname), 'docs', 'EventFileAdapter.md')).toString('utf-8')
  }

  checkOptions() {
    return {
      ...super.checkOptions(),
      logDir: Rule.string()
        .default('/var/log/vrack')
        .description('Путь до папки логов VRack'),
    };
  }

  public postEvent(str: string, event: IEvent): void {
    fs.appendFile(path.join(this.options.logDir, this.getLogName()), (new Date().toString()) + ' ' + str + '\n', 'utf8',
      (err) => { if (err) console.error('Ошибка записи в лог:', err); }
    );
  }

  getLogName() {
    const d = new Date();
    const f = [this.tt(d.getFullYear()), this.tt(d.getMonth() + 1), this.tt(d.getDate())];
    return f.join('-') + '.log';
  }

  /**
   * Преобразует числа даты меньше 10 в строку из 2х символов,
   * так же если число >= 10 преобразует его в строку
   */
  tt(s: number) {
    return (s < 10) ? '0' + s : '' + s;
  }
}