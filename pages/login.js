import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device"
import { replace } from '@zos/router'
import { setPageBrightTime } from '@zos/display'
import { DEVICE_AUTH_URL } from "../utils/config/yandex"

const { messageBuilder, localStorage, logger } = getApp()._options.globalData


Page({
    build() {
        setPageBrightTime({ brightTime: 60000, })
        messageBuilder.request({ method: "AUTH" })
            .then(data => {
                const jsonRpc = messageBuilder.buf2Json(data)

                		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 50,
			y: 48,
			w: DEVICE_WIDTH - 100,
			h: 96,
			color: 0xffffff,
			text_size: 24,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			font: 'font/font.ttf',
			text: `Введите код на ${DEVICE_AUTH_URL.replace('http://', '')}`
		})

		hmUI.createWidget(hmUI.widget.QRCODE, {
			content: DEVICE_AUTH_URL,
                    x: 140,
                    y: 140,
                    w: 200,
                    h: 200,
                    bg_x: 120,
                    bg_y: 120,
                    bg_w: 240,
                    bg_h: 240
                })

                hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 50,
                    y: 360,
                    w: DEVICE_WIDTH - 100,
                    h: 64,
                    color: 0xffffff,
                    text_size: 56,
                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V,
                    text_style: hmUI.text_style.NONE,
                    font: 'font/font.ttf',
                    text: jsonRpc.user_code
                })

                this.pollAuth(jsonRpc.device_code)
            })
    },

    pollAuth(device_code) {
        messageBuilder.request({
            method: "CHECK_AUTH",
            code: device_code
        })
            .then(data => {
                const jsonRpc = messageBuilder.buf2Json(data)
                if (jsonRpc.error == "authorization_pending") {
                    this.pollAuth(device_code)
                    return
                }
                logger.debug("login polling closed")
                localStorage.setItem('oauth', jsonRpc.access_token)
                replace({ url: 'pages/splash' })
                getApp()._options.refreshData();
            })
    },

    onInit() {
        logger.debug("login onInit invoked");
    },

    onDestroy() {
        logger.debug("login onDestroy invoked");
    },
})
