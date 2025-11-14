import { Device, Rule, Action, ErrorManager } from 'vrack2-core';
import fs from 'fs';
import path from "path";

ErrorManager.register(
  'vrack2-system.Informer',
  '0BSOCDFG9',
  'V2SYSTEM_DEVICE_NF',
  'Device on service not found',
  {
    device: Rule.string().description('Название устройства которое не найдено')
  }
);

class Informer extends Device {

  description(): string {
      return fs.readFileSync(path.join(path.dirname(__dirname), 'docs','Informer.md')).toString('utf-8')
  }

  // Параметры
  checkOptions() {
    return {
      devices: Rule.object()
        .default({})
        .example({
          Informer: { langName: 'Информер дашборда' },
        })
        .description('Дополнительно информация об устройствах в формате `{ "deviceId": { "additional": "info" } }`'),
    };
  }

  // Экшены
  actions() {
    return {
      information: Action.global().description('Получение служебной информации об устройствах'),
    };
  }

  // Инициализация / проверка существования устройств
  process() {
    for (const name in this.options.devices) {
      if (this.Container.devices[name]) continue
      this.terminate(ErrorManager.make('V2SYSTEM_DEVICE_NF', { device: name }), 'process');
    }
  }

  // Обработчик экшена
  async actionInformation() {
    return this.options.devices;
  }
}

export = Informer;