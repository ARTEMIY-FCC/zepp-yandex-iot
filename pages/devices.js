import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device" // Предполагаем, что это 480
import { push } from '@zos/router'

const { messageBuilder, localStorage, logger } = getApp()._options.globalData

// --- КОНСТАНТЫ ДИЗАЙНА ---
const SCREEN_CENTER = DEVICE_WIDTH / 2;
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
    const jsonRpc = messageBuilder.buf2Json(data)
    
    let pos = 32;

    // 1. Заголовок 
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
      text: 'Устройства'
    })

    pos += 64; 

    // 2. Генерация списка (Карточки)
    if (jsonRpc && jsonRpc.devices && jsonRpc.devices.length > 0) {
      jsonRpc.devices.forEach(element => {
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: PADDING_HORIZONTAL,
          y: pos,
          w: LIST_WIDTH,
          h: ITEM_HEIGHT,
          radius: LIST_RADIUS,
          normal_color: LIST_ITEM_BG,
          press_color: LIST_ITEM_PRESS,
          
          // Текст кнопки
          text_size: 28,
          color: 0xffffff,
          text: element.name,
          font: 'font/font.ttf',
          align_h: hmUI.align.CENTER_H, // Центрирование текста по горизонтали
          align_v: hmUI.align.CENTER_V, // Центрирование текста по вертикали
          
          click_func: (btn) => {
            push({
              url: 'pages/device_page',
              params: { id: element.id }
            })
          }
        })
        pos += ITEM_HEIGHT + ITEM_MARGIN_BOTTOM; // Обновление позиции
      })
    } else {
         // Сообщение, если устройств нет
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
            text: 'Нет подключенных устройств'
        })
        pos += 60;
    }

    // 3. Улучшенный Разделитель
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
      text: `Всего: ${jsonRpc?.devices?.length || 0} уст-в`
    })
  },
  onInit() { logger.debug("page onInit invoked"); },
  onDestroy() { logger.debug("page onDestroy invoked"); },
})
