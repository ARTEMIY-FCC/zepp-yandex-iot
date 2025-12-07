import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device"

const { messageBuilder, localStorage, logger } = getApp()._options.globalData

// --- КОНСТАНТЫ ДИЗАЙНА
const PADDING_HORIZONTAL = 40; 
const LIST_WIDTH = DEVICE_WIDTH - (PADDING_HORIZONTAL * 2);

const LIST_ITEM_BG = 0x2C2C2C;
const LIST_ITEM_PRESS = 0x3F3F3F;
const LIST_RADIUS = 24;
const ITEM_HEIGHT = 78;
const ITEM_MARGIN_BOTTOM = 10;

Page({
  build() {
    var data = localStorage.getItem('data');
    var oauth = localStorage.getItem('oauth');
    const jsonRpc = messageBuilder.buf2Json(data)

    // Начальная вертикальная позиция
    let pos = 32;

    // Заголовок
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: PADDING_HORIZONTAL,
      y: pos,
      w: LIST_WIDTH,
      h: 40,
      color: 0xffffff,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      font: 'font/font.ttf',
      text: 'Сценарии'
    })

    pos += 64;

    // Список сценариев (карточки)
    const scenarios = jsonRpc?.scenarios || [];
    const activeScenarios = scenarios.filter(s => s && s.is_active);

    if (activeScenarios.length > 0) {
      activeScenarios.forEach(element => {
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: PADDING_HORIZONTAL,
          y: pos,
          w: LIST_WIDTH,
          h: ITEM_HEIGHT,
          radius: LIST_RADIUS,
          normal_color: LIST_ITEM_BG,
          press_color: LIST_ITEM_PRESS,
          text_size: 28,
          color: 0xffffff,
          text: element.name,
          font: 'font/font.ttf',
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          click_func: (btn) => {
            // Запрос на запуск сценария
            messageBuilder.request({
              method: "SCENARIO_RUN",
              id: element.id,
              oauth: oauth
            }).then(resp => {
              // Логируем ответ и oauth для отладки
              logger.debug("SCENARIO_RUN response:", resp);
              logger.debug("oauth:", oauth);
              // Здесь можно добавить вибрацию/подтверждение, если нужно
            }).catch(err => {
              logger.error("SCENARIO_RUN error:", err);
            })
          }
        })
        pos += ITEM_HEIGHT + ITEM_MARGIN_BOTTOM;
      })
    } else {
      // Нет сценариев
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: PADDING_HORIZONTAL,
        y: pos + 10,
        w: LIST_WIDTH,
        h: 40,
        color: 0xAAAAAA,
        text_size: 24,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        font: 'font/font.ttf',
        text: 'Нет доступных сценариев'
      })
      pos += 60;
    }

    // Футер: количество сценариев (активных)
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: PADDING_HORIZONTAL,
      y: pos + 20,
      w: LIST_WIDTH,
      h: 36,
      color: 0x666666,
      text_size: 20,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      font: 'font/font.ttf',
      text: `Всего активных: ${activeScenarios.length}`
    })
  },

  onInit() { logger.debug("page onInit invoked"); },
  onDestroy() { logger.debug("page onDestroy invoked"); },
})
