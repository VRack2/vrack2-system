# VRack2 System

Набор устройств для работы с внутренними системными функциями VRack2

## Установка

Клонируем в директорию устройств (по умолчанию /opt/vrack2-service/devices)

```
cd /opt/vrack2-service/devices/
git clone https://github.com/VRack2/vrack2-system.git
```

## Текущий список устройств: 
 
 - [EventTracker] - Перехват событий устройств внутри контейнера (сервиса)
 - [EventTextAdapter] - Преобразует событие в текстовое представление
 - [EventFileAdapter] - Преобразует событие в текстовое представление и записывает его в файл лога по дням
 - [EventConsoleAdapter] - Преобразует событие в текстовое представление и отправляет его в соотвествующий вывод консоли
 - [Informer] - Служебное устройство для предоставления дополнительной метаинформации об устройствах внутри сервиса

## Связанные репозитории

- [VRack2](https://github.com/VRack2/vrack2) - фреймворк для автоматизации и управления сервисами
- [VRack2-Service](https://github.com/VRack2/vrack2-service) — запуск сервисов на базе VRack2-Core.
- [VRack2-Core](https://github.com/VRack2/vrack2-core) — фреймворк для событийно-ориентированных сервисов на JavaScript/TypeScript.
- [VGranite](https://github.com/VRack2/VGranite) — сервис для организации туннелей Socket → Serial.
- [VRack2-Remote](https://github.com/VRack2/vrack2-remote) - библиотека для работы с VRack2 API
