import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device"
import { replace, exit } from '@zos/router'

const { logger, localStorage } = getApp()._options.globalData

const COLOR_UPDATE_BG = 0x262626;
const COLOR_UPDATE_PRESS = 0x333333;
const COLOR_LOGOUT_BG = 0x330000;
const COLOR_LOGOUT_PRESS = 0x550000;
const COLOR_LOGOUT_TEXT = 0xFF4444; 

Page({
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 50, y: 32, w: DEVICE_WIDTH - 100, h: 64,
      color: 0xffffff,
      text_size: 36,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      font: 'font/font.ttf',
      text: 'Настройки'
    })

    // Кнопка ОБНОВИТЬ
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 50,
      y: 128,
      w: DEVICE_WIDTH - 100,
      h: 128,
      color: 0xffffff,
      radius: 24, 
      normal_color: COLOR_UPDATE_BG,
      press_color: COLOR_UPDATE_PRESS,
      text_size: 36,
      text: "Обновить",
      font: 'font/font.ttf',
      click_func: (btn) => {
        replace({ url: 'pages/splash' })
        getApp()._options.refreshData();
      }
    })

    // Кнопка ВЫЙТИ
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100, 
      y: 300,
      w: DEVICE_WIDTH - 200,
      h: 64,
      color: COLOR_LOGOUT_TEXT, 
      radius: 32, 
      normal_color: COLOR_LOGOUT_BG,
      press_color: COLOR_LOGOUT_PRESS,
      text_size: 24,
      text: "Выйти",
      font: 'font/font.ttf',
      click_func: (btn) => {
        localStorage.clear();
        exit()
      }
    })
  },
  onInit() { logger.debug("page onInit invoked"); },
  onDestroy() { logger.debug("page onDestroy invoked"); },
})
