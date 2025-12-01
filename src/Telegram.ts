import { Device, Port, Rule } from 'vrack2-core';
import * as https from 'https';
import { URLSearchParams } from 'url';
import fs from 'fs';
import path from "path";

class Telegram extends Device {

  description(): string {
      return fs.readFileSync(path.join(path.dirname(__dirname), 'docs','Telegram.md')).toString('utf-8')
  }

  // === Параметры ===
  checkOptions() {
    return {
      chatID: Rule.number()
        .required()
        .example(-1001252222269)
        .description('Идентификатор Telegram-чата или канала (например, `-1001234567890`)'),
      botapi: Rule.string()
        .required()
        .example('123456789:ABCdefGHIjklMNOpqrsTUVwxyZ')
        .description('Токен Telegram-бота (получается от @BotFather)'),
      parse_mode: Rule.string()
        .default('')
        .example('MarkdownV2')
        .description('Режим разбора текста сообщения (`MarkdownV2`, `HTML`, `Markdown` или пусто)'),
    };
  }

  // === Входы ===
  inputs() {
    return {
      message: Port.standart().description('Текстовое сообщение для отправки в Telegram'),
    };
  }

  // === Обработчик входа ===
  inputMessage(message: string) {
    if (typeof message !== 'string') {
      this.error('Некорректный тип сообщения: ожидается строка', { got: typeof message });
      return;
    }

    const messageQuery: Record<string, string | number> = {
      chat_id: this.options.chatID,
      text: message,
    };

    if (this.options.parse_mode) {
      messageQuery.parse_mode = this.options.parse_mode;
    }


    // Приведём всё к string
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(messageQuery)) {
        params.append(key, String(value)); // гарантированно string
    }

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${this.options.botapi}/sendMessage?${params.toString()}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        this.error(`Telegram API error: ${res.statusCode}`, {
          status: res.statusCode,
          headers: res.headers,
        });
      }
    });

    req.on('error', (e) => {
      this.error('Не удалось отправить сообщение в Telegram', {
        error: e.message,
        stack: e.stack,
        options: { ...options, botapi: '[REDACTED]' },
      });
    });

    req.end();
  }
}

export = Telegram;