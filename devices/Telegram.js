"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const vrack2_core_1 = require("vrack2-core");
const https = __importStar(require("https"));
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Telegram extends vrack2_core_1.Device {
    description() {
        return fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(__dirname), 'docs', 'Telegram.md')).toString('utf-8');
    }
    // === Параметры ===
    checkOptions() {
        return {
            chatID: vrack2_core_1.Rule.number()
                .required()
                .example(-1001252222269)
                .description('Идентификатор Telegram-чата или канала (например, `-1001234567890`)'),
            botapi: vrack2_core_1.Rule.string()
                .required()
                .example('123456789:ABCdefGHIjklMNOpqrsTUVwxyZ')
                .description('Токен Telegram-бота (получается от @BotFather)'),
            parse_mode: vrack2_core_1.Rule.string()
                .default('')
                .example('MarkdownV2')
                .description('Режим разбора текста сообщения (`MarkdownV2`, `HTML`, `Markdown` или пусто)'),
        };
    }
    // === Входы ===
    inputs() {
        return {
            message: vrack2_core_1.Port.standart().description('Текстовое сообщение для отправки в Telegram'),
        };
    }
    // === Обработчик входа ===
    inputMessage(message) {
        if (typeof message !== 'string') {
            this.error('Некорректный тип сообщения: ожидается строка', { got: typeof message });
            return;
        }
        const messageQuery = {
            chat_id: this.options.chatID,
            text: message,
        };
        if (this.options.parse_mode) {
            messageQuery.parse_mode = this.options.parse_mode;
        }
        // Приведём всё к string
        const params = new url_1.URLSearchParams();
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
                options: Object.assign(Object.assign({}, options), { botapi: '[REDACTED]' }),
            });
        });
        req.end();
    }
}
module.exports = Telegram;
