Устройство для получение событий других устройств

 - Перехватывает события внутри контейнера.
 - Дополняет их данными
 - Отправляет на соответсвующие выходы

Устройство отслеживает следующие типы событий:

- device.error - ошибки устройств
- device.notify - уведомления
- device.alert - предупреждения
- device.terminal - терминальные события
- device.event - общие события

Отправляте на выходные порты: 

 1. Общий порт event - все события без фильтрации
 2. Специализированные порты для каждого типа событий:
    - event.error
    - event.notify
    - event.alert
    - event.terminal
    - event.event

Типичный пример ивента: 

```js
{
  id: 'e761b9a98ebc06b90c9cd01806240012',
  host: 'vmain',
  service: 'szp-wp',
  name: 'СЗП дом Дом 19',
  group: 'Сервисы',
  description: 'Сервис защиты от протечек',
  event: 'terminal',
  device: 'Provider1',
  deviceType: 'vrack2-net.ConverterClient',
  data: 'READ',
  trace: '<Buffer 37 02 06 00 00 00 00 00 00 9f 18>',
  args: undefined,
  created: 1763037503094
}
```