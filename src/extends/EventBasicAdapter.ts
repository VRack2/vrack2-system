import IEvent from "./IEvent";

import { Device, Port, Rule } from 'vrack2-core'

import util from 'util'

/**
 * Класс устройства для переопределния
*/
export default class EventBasicAdapter extends Device {

  checkOptions() {
    return {
      vars: Rule.array()
        .default([
          'id', 'host', 'service', 'name', 'group',
          'description', 'event', 'device', 'deviceType',
          'data', 'trace', 'args', 'created'
        ])
        .description('Список переменных внутри объекта'),
       
      normalize: Rule.array().default(['trace', 'args']).content(Rule.string().description('Переменная для нормализации'))
        .description('Список переменных для нормализации (прим. Преобразует объект в строку)'),

      template: Rule.string()
        .default('{host}.{name}({service}).{device}({deviceType}).{event}:\n{data}\n{trace}')
        .description('Шаблон строки для замены ({var} шаблон)'),
      replace: Rule.array()
        .default([{
          reg: "(?<=password:)( *|\\n*)( *|\\n*)'(.*?)'",
          flags: 'gm',
          replace: "''"
        }]).content(
          Rule.object().fields({
            reg: Rule.string().description("Регулярное выражение в виде строки"),
            flags: Rule.string().description("Флаги регулярного выражения типа gm"),
            replace: Rule.string().description("Строка для замены, может использовать перемнные регулярных выражений")
          })
        )
        .description('Список regexp выражений для замены')
    };
  }

  inputs() {
    return {
      'event': Port.standart()
        .description('Вход события')
    };
  }

  /**
   * Инициализация регулярных выражений
   */
  process() {
    // Добавляет прямов в опции класс регекспов - нужно для оптимизации
    // поскольку набор классов не меняется, их можно создать один раз
    for (const reg of this.options.replace) reg.class = new RegExp(reg.reg, reg.flags);
  }

  /**
   * Обработчик входа event
   */
  inputEvent(event: IEvent) {
    let str = this.options.template;
    for (const vr of this.options.vars) {
      if (this.options.normalize.indexOf(vr) !== -1) {
        str = str.replace(`{${vr}}`, this.normalize(event[vr as keyof IEvent]));
      } else {
        str = str.replace(`{${vr}}`, event[vr as keyof IEvent] || '');
      }
    }
    str = this.replaceLog(str);
    this.postEvent(str, event)
  }

  /**
   * Необходимо переопределить для своей логики
   * 
   * @param str Строка преобразованная в текс
  */
  public postEvent(str: string, event: IEvent){

  }

  /**
   * Преобразовывает любое значение в строку используя util.inspect
   * 
   * @param trace 
   * @returns {string} Преобразованный объект в строку
   */
  protected normalize(trace: any) {
    if (typeof trace === 'string') return trace;
    return util.inspect(trace, {
      showHidden: false,
      depth: null,
      compact: false
    });
  }

  /**
   * Проводит замену внутри готовой строки
   * 
   * Удаляет например реальные строковые пароли
  */
  protected replaceLog(str: string) {
    for (const reg of this.options.replace) str = str.replace(reg.class, reg.replace);
    return str;
  }

}

