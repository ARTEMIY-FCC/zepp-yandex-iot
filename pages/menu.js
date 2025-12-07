import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device"
import { push } from '@zos/router'
import { onDigitalCrown, offDigitalCrown } from '@zos/interaction'
import { Vibrator, VIBRATOR_SCENE_SHORT_STRONG } from '@zos/sensor'

const vibrator = new Vibrator()
const { logger } = getApp()._options.globalData

// --- КОНСТАНТЫ ДИЗАЙНА ---
const COLOR_ACCENT = 0xB535F6;
const COLOR_ACCENT_PRESS = 0x752AF5;
const COLOR_TEXT_PRIMARY = 0xFFFFFF; // Белый текст
const BUTTON_WIDTH = DEVICE_WIDTH - 96; // 480 - 96 = 384
const BUTTON_HEIGHT = 100;
const PADDING_TOP = 80;
const SPACING = 20;

var angle = 0;
var tick = 0;
var step = 20;
var settingsButton = null;

Page({
  build() {
    // 1. Заголовок страницы
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 50,
      w: DEVICE_WIDTH,
      h: 50,
      text: "Мой Умный Дом",
      text_size: 40,
      color: COLOR_TEXT_PRIMARY,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      font: 'font/font.ttf',
    })

    const totalContentHeight = (BUTTON_HEIGHT * 2) + SPACING; // Общая высота двух кнопок и отступа
    const centerOffset = 20; // Небольшой сдвиг вверх для лучшего визуального центрирования
    let pos = (DEVICE_WIDTH / 2) - (totalContentHeight / 2) + centerOffset;

    // 2. Кнопка СЦЕНАРИИ
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: (DEVICE_WIDTH - BUTTON_WIDTH) / 2, // Центрируем по горизонтали
      y: pos,
      w: BUTTON_WIDTH,
      h: BUTTON_HEIGHT,
      color: COLOR_TEXT_PRIMARY,
      radius: BUTTON_HEIGHT / 2,
      normal_color: COLOR_ACCENT,
      press_color: COLOR_ACCENT_PRESS,
      text_size: 40, // Увеличиваем размер текста
      text: "Сценарии",
      font: 'font/font.ttf',
      click_func: () => {
        push({ url: 'pages/scenarios' })
      }
    })

    pos += BUTTON_HEIGHT + SPACING;

    // 3. Кнопка УСТРОЙСТВА
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: (DEVICE_WIDTH - BUTTON_WIDTH) / 2,
      y: pos,
      w: BUTTON_WIDTH,
      h: BUTTON_HEIGHT,
      color: COLOR_TEXT_PRIMARY,
      radius: BUTTON_HEIGHT / 2,
      normal_color: COLOR_ACCENT,
      press_color: COLOR_ACCENT_PRESS,
      text_size: 40,
      text: "Устройства",
      font: 'font/font.ttf',
      click_func: () => {
        push({ url: 'pages/devices' })
      }
    })

    // 4. Кнопка НАСТРОЙКИ
    const SETTINGS_ICON_SIZE = 64;
    settingsButton = hmUI.createWidget(hmUI.widget.IMG, {
      x: (DEVICE_WIDTH - SETTINGS_ICON_SIZE) / 2,
      y: 480 - SETTINGS_ICON_SIZE - 40, 
      w: SETTINGS_ICON_SIZE,
      h: SETTINGS_ICON_SIZE,
      src: 'settings.png',
    })

    settingsButton.addEventListener(hmUI.event.CLICK_DOWN, () => {
      push({ url: 'pages/settings' })
    });
  },

  onInit() {
    onDigitalCrown({
      callback: (key, degree) => {
        angle += degree
        tick += degree
        // Логика вибрации по шагам
        if (tick > step * 2) {
          tick -= step * 2;
          vibrator.stop()
          vibrator.setMode(VIBRATOR_SCENE_SHORT_STRONG)
          vibrator.start()
        }
        if (tick < -step) {
          tick += step;
          vibrator.stop()
          vibrator.setMode(VIBRATOR_SCENE_SHORT_STRONG)
          vibrator.start()
        }
      }
    })
    logger.debug("page onInit invoked");
  },

  onDestroy() {
    offDigitalCrown()
    logger.debug("page onDestroy invoked");
  },
})
